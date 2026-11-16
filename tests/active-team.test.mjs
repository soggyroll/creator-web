import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { QueryClient, QueryObserver } from "@tanstack/react-query";

const source = await readFile(new URL("../src/lib/active-team.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { ensureActiveTeam, initializeActiveTeam, changeActiveTeam, loadTeamMemberships, USER_BOOTSTRAP_QUERY_KEY, CURRENT_TEAM_QUERY_KEY, TEAMS_QUERY_KEY } =
  await import("data:text/javascript;base64," + Buffer.from(outputText).toString("base64"));

test("initialization waits for the default team cookie to be persisted", async () => {
  let cookie = null;
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let complete = false;
  const initialization = ensureActiveTeam([{ id: "team-a" }], async () => cookie, async id => {
    await gate;
    cookie = id;
  }).then(id => { complete = true; return id; });
  await new Promise(resolve => setImmediate(resolve));
  const completedBeforePersistence = complete;
  release();
  assert.equal(await initialization, "team-a");
  assert.equal(completedBeforePersistence, false);
  assert.equal(cookie, "team-a");
});

test("a valid existing team selection is preserved", async () => {
  const selected = await ensureActiveTeam([{ id: "team-a" }, { id: "team-b" }], async () => "team-b", async () => {
    assert.fail("An existing valid cookie should not be overwritten");
  });
  assert.equal(selected, "team-b");
});

test("a stale team cookie is replaced with an available membership", async () => {
  let cookie = "removed-team";
  const selected = await ensureActiveTeam([{ id: "team-a" }], async () => cookie, async id => { cookie = id; });
  assert.equal(selected, "team-a");
  assert.equal(cookie, "team-a");
});

test("no memberships clears a stale team selection", async () => {
  let cookie = "old-team";
  assert.equal(await ensureActiveTeam([], async () => cookie, async id => { cookie = id; }), null);
  assert.equal(cookie, null);
});

test("no memberships and no cookie remain unselected", async () => {
  assert.equal(await ensureActiveTeam([], async () => null, async () => assert.fail("No cookie write needed")), null);
});

test("a failed cookie write does not report initialization as ready", async () => {
  await assert.rejects(ensureActiveTeam([{ id: "team-a" }], async () => null, async () => {
    throw new Error("cookie write failed");
  }), /cookie write failed/);
});

test("switching teams refetches active data only after saving the new cookie", async t => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  t.after(() => client.clear());
  let cookie = "team-a";
  client.setQueryData(TEAMS_QUERY_KEY, [{ id: "team-a" }, { id: "team-b" }]);
  client.setQueryData(CURRENT_TEAM_QUERY_KEY, "team-a");
  client.setQueryData(["me", "credits"], "team-a credits");
  client.setQueryData(["transactions"], "team-a transactions");
  const observer = new QueryObserver(client, {
    queryKey: ["me", "credits"],
    queryFn: async () => cookie + " credits",
    staleTime: Infinity,
  });
  const unsubscribe = observer.subscribe(() => {});
  t.after(unsubscribe);
  await changeActiveTeam(client, "team-b", async id => { cookie = id; });
  assert.equal(client.getQueryData(["me", "credits"]), "team-b credits");
  assert.equal(client.getQueryData(["transactions"]), undefined);
  assert.equal(client.getQueryData(CURRENT_TEAM_QUERY_KEY), "team-b");
  assert.deepEqual(client.getQueryData(TEAMS_QUERY_KEY), [{ id: "team-a" }, { id: "team-b" }]);
});

test("a failed team switch preserves the previous selection and cached data", async t => {
  const client = new QueryClient();
  t.after(() => client.clear());
  client.setQueryData(CURRENT_TEAM_QUERY_KEY, "team-a");
  client.setQueryData(["me", "credits"], "team-a credits");
  await assert.rejects(changeActiveTeam(client, "team-b", async () => { throw new Error("save failed"); }), /save failed/);
  assert.equal(client.getQueryData(CURRENT_TEAM_QUERY_KEY), "team-a");
  assert.equal(client.getQueryData(["me", "credits"]), "team-a credits");
});

test("clearing the last team drops cached data without issuing a teamless refetch", async t => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  t.after(() => client.clear());
  client.setQueryData(CURRENT_TEAM_QUERY_KEY, "team-a");
  client.setQueryData(["me", "credits"], "team-a credits");
  let requests = 0;
  const observer = new QueryObserver(client, {
    queryKey: ["me", "credits"],
    queryFn: async () => { requests++; return "no team"; },
    staleTime: Infinity,
  });
  const unsubscribe = observer.subscribe(() => {});
  t.after(unsubscribe);
  await changeActiveTeam(client, null, async () => {});
  assert.equal(requests, 0);
  assert.equal(client.getQueryData(["me", "credits"]), undefined);
  assert.equal(client.getQueryData(CURRENT_TEAM_QUERY_KEY), null);
});

test("recovering a removed membership clears the previous team's cached data", async t => {
  const client = new QueryClient();
  t.after(() => client.clear());
  let cookie = "removed-team";
  client.setQueryData(CURRENT_TEAM_QUERY_KEY, "removed-team");
  client.setQueryData(["transactions"], "removed-team transactions");
  client.setQueryData(["generations"], "removed-team generations");
  const selected = await initializeActiveTeam(client, [{ id: "team-b" }], async () => cookie, async id => { cookie = id; });
  assert.equal(selected, "team-b");
  assert.equal(cookie, "team-b");
  assert.equal(client.getQueryData(["transactions"]), undefined);
  assert.equal(client.getQueryData(["generations"]), undefined);
  assert.equal(client.getQueryData(CURRENT_TEAM_QUERY_KEY), "team-b");
});

test("account bootstrap completes before memberships are requested", async t => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  t.after(() => client.clear());
  const events = [];
  const teams = await loadTeamMemberships(client, async () => { events.push("bootstrap"); return { id: "user-a" }; }, async () => { events.push("memberships"); return [{ id: "personal-team" }]; });
  assert.deepEqual(events, ["bootstrap", "memberships"]);
  assert.deepEqual(teams, [{ id: "personal-team" }]);
});

test("membership refreshes reuse completed account bootstrap", async t => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  t.after(() => client.clear());
  let bootstraps = 0;
  const bootstrap = async () => { bootstraps++; return { id: "user-a" }; };
  await loadTeamMemberships(client, bootstrap, async () => []);
  await loadTeamMemberships(client, bootstrap, async () => [{ id: "team-a" }]);
  assert.equal(bootstraps, 1);
});

test("failed account bootstrap does not return a misleading empty membership list", async t => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  t.after(() => client.clear());
  let loadedTeams = false;
  await assert.rejects(loadTeamMemberships(client, async () => { throw new Error("account sync failed"); }, async () => { loadedTeams = true; return []; }), /account sync failed/);
  assert.equal(loadedTeams, false);
});

test("switching teams preserves the authenticated account bootstrap", async t => {
  const client = new QueryClient();
  t.after(() => client.clear());
  client.setQueryData(USER_BOOTSTRAP_QUERY_KEY, { id: "user-a" });
  await changeActiveTeam(client, "team-b", async () => {});
  assert.deepEqual(client.getQueryData(USER_BOOTSTRAP_QUERY_KEY), { id: "user-a" });
});

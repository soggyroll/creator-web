/** @format */

"use client";

import { ArrowDownIcon, ArrowUpIcon, CoinsIcon, PlusIcon } from "lucide-react";

import { useCreditBalance } from "@/hooks/use-credit-balance";
import { useTransactionHistory } from "@/hooks/use-transaction-history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLedgerEntryKind } from "@/lib/utils";
import { PageHeading } from "@/components/studio/page-heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BillingPage() {
  const { data: credits, isLoading: loadingCredits, isError: creditError, refetch: refetchCredits } = useCreditBalance();
  const { data: transactions, isLoading: loadingTx, isError: transactionError, refetch: refetchTransactions } = useTransactionHistory();

  function handleBuyCredits() {
    // TODO: redirect to Stripe checkout once the billing endpoint is available
    alert("Stripe checkout coming soon!");
  }

  return (
    <div className="studio-page">
      {/* Header */}
      <PageHeading eyebrow="Credits & billing" title={<>More room<br /><span className="text-primary">to create.</span></>} description="Your credits and transaction history. Keep track of what goes into your next idea." />

      {/* Balance row */}
      <div className="studio-balance">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Current balance
          </p>
          {loadingCredits ? (
            <Skeleton className="mt-2 h-10 w-32" />
          ) : (
            <p className="studio-balance-value tabular-nums">
              {credits?.balance?.toLocaleString() ?? "—"}
              <span className="ml-2 text-lg font-normal text-muted-foreground">
                credits
              </span>
            </p>
          )}
        </div>
        <Button onClick={handleBuyCredits}>
          <PlusIcon className="size-4" />
          Buy Credits
        </Button>
      </div>

      {creditError && <Alert variant="destructive" className="mt-6"><AlertTitle>Credit balance unavailable.</AlertTitle><AlertDescription><Button variant="outline" onClick={() => refetchCredits()}>Try again</Button></AlertDescription></Alert>}

      {/* Transaction history */}
      <div className="mt-8">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Transaction History
        </p>

        {transactionError ? <Alert variant="destructive"><AlertTitle>Transaction history unavailable.</AlertTitle><AlertDescription><Button variant="outline" onClick={() => refetchTransactions()}>Try again</Button></AlertDescription></Alert> : loadingTx ? (
          <div className="flex flex-col divide-y rounded-lg border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-full max-w-52" />
                  <Skeleton className="h-3 w-full max-w-28" />
                </div>
                <Skeleton className="h-5 w-12 shrink-0" />
              </div>
            ))}
          </div>
        ) : !transactions?.data?.length ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-20 text-center">
            <CoinsIcon className="size-10 opacity-30" />
            <div>
              <p className="text-sm font-medium">No transactions yet</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Purchases and generation costs will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col divide-y rounded-lg border">
            {transactions.data.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-wrap items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/40"
              >
                {/* Icon */}
                <div
                  className={[
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    tx.kind !== "charge"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {tx.kind === "charge" ? (
                    <ArrowDownIcon className="size-3.5" />
                  ) : (
                    <ArrowUpIcon className="size-3.5" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Type badge */}
                <Badge
                  variant="secondary"
                  className={
                    tx.kind !== "charge"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : ""
                  }
                >
                  {formatLedgerEntryKind(tx.kind)}
                </Badge>

                {/* Amount */}
                <span
                  className={[
                    "shrink-0 text-sm font-medium tabular-nums",
                    tx.kind === "charge"
                      ? "text-primary"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {tx.delta}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

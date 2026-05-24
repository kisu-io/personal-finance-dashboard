"use client";
import { NetWorthHero } from "./cards/NetWorthHero";
import { AllocationCard } from "./cards/AllocationCard";
import { MyPortfolioCard } from "./cards/MyPortfolioCard";
import { CashFlowCard } from "./cards/CashFlowCard";
import { ContributionsCard } from "./cards/ContributionsCard";
import { StockMarketCard } from "./cards/StockMarketCard";
import { ActivityCard } from "./cards/ActivityCard";

export function OverviewDesktop() {
  return (
    <div className="animate-fade-up px-8 pb-10 pt-2">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <NetWorthHero />
        </div>

        <div className="col-span-12 lg:col-span-5">
          <AllocationCard />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <MyPortfolioCard />
        </div>

        <div className="col-span-12 lg:col-span-7">
          <CashFlowCard />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <ContributionsCard />
        </div>

        <div className="col-span-12 lg:col-span-7">
          <StockMarketCard />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <ActivityCard />
        </div>
      </div>
    </div>
  );
}

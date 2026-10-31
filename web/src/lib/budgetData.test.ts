import { describe, expect, it } from 'vitest';
import {
  annualFinancials as q,
  currentYear as cy,
  fiscalSource,
  financialOutlook,
  fiscalYears,
  specialFunds,
} from './budgetData';
import { procurementNotices } from './infrastructureData';
import en from '../locales/en.json';
import ceb from '../locales/ceb.json';

describe('transparency data integrity', () => {
  it('reconciles receipts and expenditure categories, including non-operating amounts', () => {
    expect(q.receipts.local + q.receipts.external + q.receipts.nonIncome).toBeCloseTo(
      q.receipts.total,
      2
    );
    const { total, ...categories } = q.expenditures;
    expect(
      Math.abs(
        Object.values(categories).reduce<number>((sum, amount) => sum + (amount ?? 0), 0) - total
      )
    ).toBeLessThanOrEqual(0.011);
    expect(q.receipts.nta).toBeLessThanOrEqual(q.receipts.external);
  });

  it('reconciles ending cash after prior-year payments and continuing appropriations', () => {
    // Independently rounded source columns can differ by PHP 0.01 million.
    const availableCash = q.beginningCashBalance + q.receipts.total - q.expenditures.total;
    expect(Math.abs(availableCash - q.fundCashAvailable)).toBeLessThanOrEqual(0.011);
    const endingCash = q.fundCashAvailable - q.priorYearPayables - q.continuingAppropriation;
    expect(Math.abs(endingCash - q.endingCashBalance)).toBeLessThanOrEqual(0.011);
  });

  it('reconciles every reported year, each from its own source edition', () => {
    const years = fiscalYears.map((y) => y.year);
    expect(years).toEqual([...years].sort((a, b) => a - b));
    expect(new Set(years).size).toBe(years.length);
    expect(new Set(fiscalYears.map((y) => y.source.url)).size).toBe(fiscalYears.length);
    for (const y of fiscalYears) {
      const r = y.receipts;
      // Independently rounded source columns can differ by PHP 0.01 million.
      expect(Math.abs(r.local + r.external + r.nonIncome - r.total), y.period).toBeLessThanOrEqual(
        0.011
      );
      expect(r.nta, y.period).toBeLessThanOrEqual(r.external);
      const { total, ...categories } = y.expenditures;
      const spent = Object.values(categories).reduce<number>((sum, a) => sum + (a ?? 0), 0);
      expect(Math.abs(spent - total), y.period).toBeLessThanOrEqual(0.011);
      const available = y.beginningCashBalance + r.total - total;
      expect(Math.abs(available - y.fundCashAvailable), y.period).toBeLessThanOrEqual(0.011);
      const ending = y.fundCashAvailable - y.priorYearPayables - y.continuingAppropriation;
      expect(Math.abs(ending - y.endingCashBalance), y.period).toBeLessThanOrEqual(0.011);
      // A BESF edition reports the fiscal year two years before its own.
      expect(y.source.url, y.period).toContain(`/BESF${y.year + 2}/F13.pdf`);
      expect(y.status).toBe('reported');
    }
  });

  it('keeps the fiscal year distinct from the source publication year', () => {
    expect(q.year).toBe(2025);
    expect(q.status).toBe('reported');
    expect(fiscalSource.url).toContain('/BESF2027/F13.pdf');
    expect(fiscalSource.pages).toEqual([594, 595]);
  });

  it('keeps current and future year planning figures separate from reported results', () => {
    expect(financialOutlook.map((r) => r.year)).toEqual([2026, 2027]);
    for (const record of financialOutlook) {
      expect(record.status).toBe('planning');
      expect(record.year).toBeGreaterThan(q.year);
      expect(record.nta).toBeLessThan(record.receipts);
      expect(record.source.url).toContain('/BESF2027/');
    }
  });

  it('reconciles the current year to date and keeps it out of the reported years', () => {
    expect(cy.status).toBe('year-to-date');
    expect(fiscalYears.map((y) => y.year)).not.toContain(cy.year);
    const r = cy.receipts;
    expect(Math.abs(r.local + r.external + r.nonIncome - r.total)).toBeLessThanOrEqual(0.011);
    expect(r.nta).toBeLessThanOrEqual(r.external);
    const { total, ...categories } = cy.expenditures;
    const spent = Object.values(categories).reduce<number>((sum, a) => sum + a, 0);
    expect(Math.abs(spent - total)).toBeLessThanOrEqual(0.011);
    expect(
      Math.abs(cy.beginningCashBalance + r.total - total - cy.fundCashAvailable)
    ).toBeLessThanOrEqual(0.011);
    expect(
      Math.abs(
        cy.fundCashAvailable -
          cy.priorYearPayables -
          cy.continuingAppropriation -
          cy.endingCashBalance
      )
    ).toBeLessThanOrEqual(0.011);
    // A part-year never exceeds the City's own full-year allocation.
    expect(r.nta).toBeLessThan(cy.budget.ntaAllocation);
    expect(cy.budget.ntaAllocation).toBe(financialOutlook.find((o) => o.year === cy.year)!.nta);
  });

  it('gives every new finance figure an official source and check date', () => {
    const sources = [
      cy.source,
      cy.budget.source,
      specialFunds.developmentFund.source,
      specialFunds.ldrrmf.source,
      q.crossCheck!,
    ];
    for (const s of sources) {
      expect(['blgf.gov.ph', 'fdpp.dilg.gov.ph']).toContain(new URL(s.url).hostname);
      expect(s.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    const df = specialFunds.developmentFund;
    expect(df.obligated).toBeLessThanOrEqual(df.appropriation);
    expect(df.loanAmortization.obligated).toBeLessThanOrEqual(df.obligated);
    expect(df.projectsWithoutObligation).toBeLessThanOrEqual(df.projects);
    const drr = specialFunds.ldrrmf;
    expect(
      Math.abs(drr.mitigation.appropriation + drr.quickResponse.appropriation - drr.appropriation)
    ).toBeLessThanOrEqual(0.011);
    expect(
      Math.abs(drr.mitigation.spent + drr.quickResponse.spent - drr.spent)
    ).toBeLessThanOrEqual(0.011);
  });

  it('keeps procurement ceilings separate from unknown awards and completion', () => {
    expect(new Set(procurementNotices.map((p) => p.reference)).size).toBe(
      procurementNotices.length
    );
    for (const p of procurementNotices) {
      expect(p.abc).toBeGreaterThan(0);
      expect(p.awardAmount).toBeNull();
      expect(p.completionPercent).toBeNull();
      expect(p.contractor).toBeNull();
      const url = new URL(p.sourceUrl);
      if (p.sourceName === 'PhilGEPS') {
        expect(url.hostname).toBe('notices.philgeps.gov.ph');
        expect(url.searchParams.get('refid')).toBe(p.reference);
      } else {
        expect(url.hostname).toBe('ffedis.da.gov.ph');
        expect(p.noticeStatus).toBe('Closed Expired');
        expect(p.updatedOn).toBeNull();
        expect(p.publishedOn).toBe('2026-07-14');
      }
    }
    expect(new Set(procurementNotices.map((p) => p.scope))).toEqual(new Set(['local', 'national']));
  });

  it('provides transparency explanations in every supported language', () => {
    for (const key of Object.keys(en).filter((key) => key.startsWith('trans-'))) {
      for (const locale of [ceb]) expect(locale).toHaveProperty(key);
    }
  });
});

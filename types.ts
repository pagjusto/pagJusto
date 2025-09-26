export interface FormData {
  financingDate: string;
  financedAmount: number;
  downPayment: number;
  installmentAmount: number;
  installments: number;
  fullName: string;
  whatsappNumber: string;
}

export interface CalculationResult {
  userRate: number;
  marketRate: number;
  abusiveThresholdRate: number;
  userInstallment: number;
  marketInstallment: number;
  userTotal: number;
  marketTotal: number;
}

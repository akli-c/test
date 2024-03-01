import axios from "axios";
import { Company, PostCompaniesBody } from "../types/company-types";
import { X_API_KEY_HEADER } from "../../../constants";

export class ErpCompanyClient {
  private apiKey_: string;

  constructor(apiKey: string) {
    this.apiKey_ = apiKey;
  }

  async updateOrCreateCompanies(companies: Company[]): Promise<void> {
    try {
      const companyBody: PostCompaniesBody = {
        companies: companies,
      };

      const url = (process.env.ERP_API_URL as string) + "catalog/companies";

      const config = {
        headers: {
          [X_API_KEY_HEADER]: this.apiKey_,
        },
      };

      await axios.post(url, companyBody, config);

      console.info("Successfully updated or created companies");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to update or create companies:", error.status, error.response);
      } else {
        console.error("Failed to update or create companies", error);
      }
      throw error;
    }
  }
}

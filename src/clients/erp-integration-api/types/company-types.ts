import { Address } from "./address-types";
import { Metadata } from "./base-types";

export interface PostCompaniesBody {
  /**
   * companies to update or create
   */
  companies: Company[];
}

export interface Company {
  /**
   * catalog company id (tech)
   * if defined for update, used to find the company to update
   */
  id?: string;

  /**
   * company name
   */
  name: string;

  /**
   * company code in the external system
   */
  code?: string;

  /**
   * if seller has some companies (for example one by country, put it in this field)
   */
  seller_company_code?: string;

  /**
   * parent company name
   */
  parent_company_name?: string;

  /**
   * parent company code
   * should be preferred to parent_company_name
   */
  parent_company_code?: string;

  /**
   * company website
   */
  website?: string;
  /**
   * siret
   */
  siret?: string;

  /**
   * vat number
   */
  vat_number?: string;

  /**
   * billing address
   */
  billing_address?: Address;

  /*
   * shipping addresses
   */
  shipping_addresses?: Address[];

  /**
   * contacts
   */
  contacts?: Contact[];

  /**
   * agent in charge of the company
   */
  agent?: Agent;

  /**
   * catalog name
   * if one contains company name, will be prioritized
   * for the moment contains only 2 catalogs
   */
  catalog_names?: string[];

  /**
   * payment currency
   */
  payment_currency?: string;

  /**
   * payment method
   * could be sepa, check, transfer, paypal, credit_card, ...
   * @enum {string}
   */
  payment_methods?: string[];

  /**
   * payment delay in days
   */
  payment_delay?: number;

  /**
   * franco in company currency
   */
  franco?: number;

  /**
   * customers : buyers, users who will connect to the platform
   */
  customers?: Customer[];

  /**
   * metadata
   */
  metadata?: Metadata[];
}

export interface Person {
  /**
   * first name
   */
  first_name?: string;

  /**
   * last name
   */
  last_name?: string;

  /**
   * email
   */
  email: string;

  /**
   * phone number
   */
  phone?: string;
}

export interface Contact extends Person {
  /**
   * position in the company
   */
  position?: string;
}

export interface Agent extends Person {}

export interface Customer extends Person {
  /**
   * position in the company
   */
  position?: string;

  /**
   * names of the groups the user belongs to
   */
  group_names?: string[];
}

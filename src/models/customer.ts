export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export type CreateCustomerInput = Omit<Customer, "id">;
export type UpdateCustomerInput = Partial<CreateCustomerInput>;

export type CustomerId = string;


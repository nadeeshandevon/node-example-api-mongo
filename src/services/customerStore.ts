import { CreateCustomerInput, Customer, UpdateCustomerInput } from "../models/customer";
import { CustomerModel } from "../models/customerModel";

const toCustomer = (doc: any): Customer => ({
  id: doc.id ?? doc._id?.toString?.() ?? doc._id,
  firstName: doc.firstName,
  lastName: doc.lastName,
  email: doc.email,
  phone: doc.phone,
});

class CustomerStore {
  async list(): Promise<Customer[]> {
    const docs = await CustomerModel.find().lean().exec();
    return docs.map(toCustomer);
  }

  async get(id: string): Promise<Customer | null> {
    const doc = await CustomerModel.findById(id).lean().exec();
    return doc ? toCustomer(doc) : null;
  }

  async create(input: CreateCustomerInput): Promise<Customer> {
    const doc = new CustomerModel(input);
    const saved = await doc.save();
    return toCustomer(saved.toJSON());
  }

  async update(id: string, updates: UpdateCustomerInput): Promise<Customer | null> {
    const updated = await CustomerModel.findByIdAndUpdate(id, updates, { new: true }).lean().exec();
    return updated ? toCustomer(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CustomerModel.findByIdAndDelete(id).lean().exec();
    return Boolean(result);
  }
}

const store = new CustomerStore();

export default store;


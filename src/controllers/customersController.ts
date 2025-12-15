import { NextFunction, Request, Response } from "express";
import store from "../services/customerStore";
import { CreateCustomerInput } from "../models/customer";

const requireFields = (fields: (keyof CreateCustomerInput)[], body: Partial<CreateCustomerInput>) =>
  fields.every((field) => {
    const value = body[field];
    return typeof value === "string" && value.trim().length > 0;
  });

export const listCustomers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await store.list();
    res.json(customers);
  } catch (err) {
    next(err);
  }
};

export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await store.get(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.json(customer);
  } catch (err) {
    next(err);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, phone } = (req.body ?? {}) as Partial<CreateCustomerInput>;
    if (!requireFields(["firstName", "lastName", "email"], req.body ?? {})) {
      return res.status(400).json({ message: "firstName, lastName and email are required" });
    }
    const customer = await store.create({
      firstName: firstName!,
      lastName: lastName!,
      email: email!,
      phone,
    });
    return res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, phone } = (req.body ?? {}) as Partial<CreateCustomerInput>;
    const updates: Partial<CreateCustomerInput> = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;

    const updated = await store.update(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const removed = await store.delete(req.params.id);
    if (!removed) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};


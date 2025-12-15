import { Schema, model } from "mongoose";
import { randomBytes } from "crypto";
import { Customer } from "./customer";

export type CustomerDb = Customer & { _id: string };

const customerSchema = new Schema<CustomerDb>(
  {
    _id: { type: String, default: () => randomBytes(4).toString("hex") },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

customerSchema.set("toJSON", {
  versionKey: false,
  virtuals: true,
  transform(_doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export const CustomerModel = model<CustomerDb>("Customer", customerSchema);


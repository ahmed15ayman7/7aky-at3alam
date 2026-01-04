export interface Child {
  id: string;
  name: string;
  dateOfBirth: Date;
  age: number;
  gender: "male" | "female";
  address?: string;
  fatherJob?: string;
  motherJob?: string;
  phone?: string;
  hasRelativeIssue: boolean;
  centerId: string;
  therapistId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChildFormData {
  name: string;
  dateOfBirth: Date;
  gender: "male" | "female";
  address?: string;
  fatherJob?: string;
  motherJob?: string;
  phone?: string;
  hasRelativeIssue?: boolean;
  centerId: string;
  therapistId: string;
}


import React from "react";
import { UseFormRegisterReturn } from "react-hook-form/dist/types";

export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  comments: Comment[];
  description: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
  body: [object];
}

export interface Comment {
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  post: {
    _ref: string;
    _type: string;
  };
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}

export interface iInput {
  children: React.ReactNode;
  placeholder: string;
  type: string;
  register: UseFormRegisterReturn<string>;
}

export interface iForm {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

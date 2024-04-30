import express from "express";
import mongoose from "mongoose";

export const mockUser = {
  _id: new mongoose.Types.ObjectId().toHexString(),
  username: "FluffyPaws123",
  email: "fluffy@example.com",
  authentication: {
    password: "[meowmeow]",
    salt: "[purrrrrrr]",
    sessionToken: "[mewmew]",
  },
};

export const mockUser1 = {
  username: "FluffyPaws123",
  email: "fluffy@example.com",
  authentication: {
    password: "[meowmeow]",
    salt: "[purrrrrrr]",
    sessionToken: "[mewmew]",
  },
};

export const mockUser2 = {
  username: "PumpkinSpice101",
  email: "pumpkin@example.com",
  authentication: {
    password: "[spooky123]",
    salt: "[halloween]",
    sessionToken: "[trickortreat]",
  },
};

export const mockUserId = new mongoose.Types.ObjectId().toHexString();

export const mockPlace = {
  name: "The cozy corner of my kitchen",
  user: { username: mockUser.username, email: mockUser.email },
};

export const mockPlace1 = {
  name: "Dreamy Book Nook",
  user: { username: mockUser.username, email: mockUser.email },
};

export const mockPlaces = [
  {
    name: "Kaufland",
    user: {
      username: mockUser.username,
      email: mockUser.email,
    },
  },
  {
    name: "Magic Garden Cafe",
    user: {
      username: mockUser.username,
      email: mockUser.email,
    },
  },
  {
    name: "Dreamy Book Nook",
    user: {
      username: mockUser.username,
      email: mockUser.email,
    },
  },
];

export const mockProduct = {
  name: "Coffee",
  quantity: "Depends on the day's chaos level",
  category: "Essentials",
  place: { name: "The cozy corner of my kitchen" },
};
export const mockUpdatedProduct = {
  name: "Chocolate",
  quantity: "Depends on the day's chaos level",
  category: "Essentials",
  place: { name: "The cozy corner of my kitchen" },
};

//🌟🌈💖💃🌞
export const mockProducts = [
  {
    name: "Coffee",
    quantity: "Depends on the day's chaos level",
    category: "Essentials",
    place: { name: "The cozy corner of my kitchen" },
  },
  {
    name: "Book",
    quantity: "Countless",
    category: "Escapes",
    place: { name: "My cozy reading nook" },
  },
  {
    name: "Pizza",
    quantity: "Enough to share... or not",
    category: "Comfort Food",
    place: { name: "The couch fort in my living room" },
  },
  {
    name: "Yarn",
    quantity: "In every color of the rainbow",
    category: "Craft Supplies",
    place: { name: "My creative corner, where magic happens" },
  },
  {
    name: "Board Game",
    quantity: "Enough for a marathon",
    category: "Entertainment",
    place: { name: "The table that's seen countless victories and defeats" },
  },
];

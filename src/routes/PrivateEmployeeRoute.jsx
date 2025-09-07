/**
  Sprawdza czy użytkownik łączący się bezpośrednio z panelem ma odpowiedni token pracownika.
  Jeśli ma token klienta przenoszony zostaje do strony homePage.
  Jeśli ma token gościa przenoszony zostaje do strony login.
*/

import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateEmployeeRoute({ children }) {
  const token = localStorage.getItem("token");
  const isEmployee = JSON.parse(localStorage.getItem("isEmployee") || localStorage.getItem("is_employee") || "false");

  if (!token) return <Navigate to="/login" />;
  if (!isEmployee) return <Navigate to="/homePage" />;
  return children;
}

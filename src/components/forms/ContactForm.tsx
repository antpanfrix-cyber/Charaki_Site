"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactForm() {
  const t = useTranslations("ContactPage");
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormValues, string>>
  >({});
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleChange(field: keyof ContactFormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function validate() {
    const nextErrors: Partial<Record<keyof ContactFormValues, string>> = {};
    if (!values.name.trim()) nextErrors.name = t("requiredError");
    if (!values.email.trim()) {
      nextErrors.email = t("requiredError");
    } else if (!EMAIL_PATTERN.test(values.email)) {
      nextErrors.email = t("invalidEmailError");
    }
    if (!values.message.trim()) nextErrors.message = t("requiredError");

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
      setValues(initialValues);
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-gold/30 bg-ivory p-8 text-center">
        <div className="mx-auto h-px w-12 bg-gold" />
        <p className="mt-4 text-base text-navy">{t("successMessage")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-name"
          className="text-sm font-semibold text-navy"
        >
          {t("formNameLabel")}
        </label>
        <input
          id="contact-name"
          type="text"
          value={values.name}
          onChange={handleChange("name")}
          placeholder={t("formNamePlaceholder")}
          className="rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy placeholder:text-navy/40 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
        />
        {errors.name ? (
          <p className="text-sm text-red-600">{errors.name}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-email"
          className="text-sm font-semibold text-navy"
        >
          {t("formEmailLabel")}
        </label>
        <input
          id="contact-email"
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          placeholder={t("formEmailPlaceholder")}
          className="rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy placeholder:text-navy/40 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
        />
        {errors.email ? (
          <p className="text-sm text-red-600">{errors.email}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-phone"
          className="text-sm font-semibold text-navy"
        >
          {t("formPhoneLabel")}
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={values.phone}
          onChange={handleChange("phone")}
          placeholder={t("formPhonePlaceholder")}
          className="rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy placeholder:text-navy/40 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-message"
          className="text-sm font-semibold text-navy"
        >
          {t("formMessageLabel")}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={values.message}
          onChange={handleChange("message")}
          placeholder={t("formMessagePlaceholder")}
          className="resize-y rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy placeholder:text-navy/40 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
        />
        {errors.message ? (
          <p className="text-sm text-red-600">{errors.message}</p>
        ) : null}
      </div>

      {status === "error" ? (
        <p className="text-sm text-red-600">{t("errorMessage")}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-navy px-8 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}

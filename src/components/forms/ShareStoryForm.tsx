"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type ShareStoryFormValues = {
  name: string;
  familyName: string;
  email: string;
  placeOfOrigin: string;
  approximateDate: string;
  story: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues: ShareStoryFormValues = {
  name: "",
  familyName: "",
  email: "",
  placeOfOrigin: "",
  approximateDate: "",
  story: "",
};

export function ShareStoryForm() {
  const t = useTranslations("ShareStory");
  const [values, setValues] = useState<ShareStoryFormValues>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShareStoryFormValues, string>>
  >({});
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleChange(field: keyof ShareStoryFormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function validate() {
    const nextErrors: Partial<Record<keyof ShareStoryFormValues, string>> =
      {};
    if (!values.name.trim()) nextErrors.name = t("requiredError");
    if (!values.email.trim()) {
      nextErrors.email = t("requiredError");
    } else if (!EMAIL_PATTERN.test(values.email)) {
      nextErrors.email = t("invalidEmailError");
    }
    if (!values.story.trim()) nextErrors.story = t("requiredError");

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/story", {
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

  return (
    <section className="rounded-3xl bg-navy px-6 py-16 sm:px-12">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-ivory sm:text-4xl">
          {t("heading")}
        </h2>
        <p className="mt-4 text-lg text-gold">{t("subheading")}</p>
        <p className="mt-4 text-sm text-ivory/70">{t("description")}</p>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        {status === "success" ? (
          <div className="rounded-2xl border border-gold/30 bg-navy p-8 text-center">
            <div className="mx-auto h-px w-12 bg-gold" />
            <p className="mt-4 text-base text-ivory">
              {t("successMessage")}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="story-name"
                  className="text-sm font-semibold text-ivory"
                >
                  {t("formNameLabel")}
                </label>
                <input
                  id="story-name"
                  type="text"
                  value={values.name}
                  onChange={handleChange("name")}
                  placeholder={t("formNamePlaceholder")}
                  className="rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-2.5 text-ivory placeholder:text-ivory/40 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                />
                {errors.name ? (
                  <p className="text-sm text-gold">{errors.name}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="story-family-name"
                  className="text-sm font-semibold text-ivory"
                >
                  {t("formFamilyNameLabel")}
                </label>
                <input
                  id="story-family-name"
                  type="text"
                  value={values.familyName}
                  onChange={handleChange("familyName")}
                  placeholder={t("formFamilyNamePlaceholder")}
                  className="rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-2.5 text-ivory placeholder:text-ivory/40 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="story-email"
                className="text-sm font-semibold text-ivory"
              >
                {t("formEmailLabel")}
              </label>
              <input
                id="story-email"
                type="email"
                value={values.email}
                onChange={handleChange("email")}
                placeholder={t("formEmailPlaceholder")}
                className="rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-2.5 text-ivory placeholder:text-ivory/40 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
              />
              {errors.email ? (
                <p className="text-sm text-gold">{errors.email}</p>
              ) : null}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="story-place"
                  className="text-sm font-semibold text-ivory"
                >
                  {t("formPlaceOfOriginLabel")}
                </label>
                <input
                  id="story-place"
                  type="text"
                  value={values.placeOfOrigin}
                  onChange={handleChange("placeOfOrigin")}
                  placeholder={t("formPlaceOfOriginPlaceholder")}
                  className="rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-2.5 text-ivory placeholder:text-ivory/40 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="story-date"
                  className="text-sm font-semibold text-ivory"
                >
                  {t("formApproximateDateLabel")}
                </label>
                <input
                  id="story-date"
                  type="text"
                  value={values.approximateDate}
                  onChange={handleChange("approximateDate")}
                  placeholder={t("formApproximateDatePlaceholder")}
                  className="rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-2.5 text-ivory placeholder:text-ivory/40 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="story-story"
                className="text-sm font-semibold text-ivory"
              >
                {t("formStoryLabel")}
              </label>
              <textarea
                id="story-story"
                rows={6}
                value={values.story}
                onChange={handleChange("story")}
                placeholder={t("formStoryPlaceholder")}
                className="resize-y rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-2.5 text-ivory placeholder:text-ivory/40 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
              />
              {errors.story ? (
                <p className="text-sm text-gold">{errors.story}</p>
              ) : null}
            </div>

            {status === "error" ? (
              <p className="text-sm text-gold">{t("errorMessage")}</p>
            ) : null}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mx-auto mt-2 inline-flex w-fit items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-navy transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? t("sending") : t("submit")} →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

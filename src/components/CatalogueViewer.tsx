"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  type Catalogue,
  cataloguePageImage,
  CATALOGUE_OFFER_TERMS,
} from "@/lib/catalogues";
import { postEnquiry } from "@/lib/enquiry";
import { trackConversion } from "@/lib/analytics";

export default function CatalogueViewer({
  catalogue,
}: {
  catalogue: Catalogue;
}) {
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [intent, setIntent] = useState<"discount" | "discovery">("discount");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<"discount" | "discovery" | null>(null);
  const [shopUrl, setShopUrl] = useState("");
  const [preview, setPreview] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const offerButton = useRef<HTMLButtonElement>(null);
  const shown = useRef(false);

  function openOffer() {
    shown.current = true;
    try {
      sessionStorage.setItem(`yos-catalogue-offer-${catalogue.id}`, "shown");
    } catch {
      /* Optional suppression only. */
    }
    dialog.current?.showModal();
  }
  useEffect(() => {
    if (!loaded) return;
    let elapsed = 0;
    let last = performance.now();
    const key = `yos-catalogue-offer-${catalogue.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      /* Viewing still works without storage. */
    }
    const visibility = () => {
      last = performance.now();
    };
    document.addEventListener("visibilitychange", visibility);
    const timer = setInterval(() => {
      if (shown.current) {
        clearInterval(timer);
        return;
      }
      const now = performance.now();
      if (!document.hidden) elapsed += now - last;
      last = now;
      if (elapsed >= 10000 && !shown.current) {
        shown.current = true;
        try {
          sessionStorage.setItem(key, "shown");
        } catch {
          /* Optional session suppression only. */
        }
        openOffer();
        clearInterval(timer);
      }
    }, 250);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [loaded, catalogue.id]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await postEnquiry("/api/catalogue-interest", {
        catalogue: catalogue.id,
        intent,
        email: data.get("email"),
        name: data.get("name") || "",
        message: data.get("message") || "",
        _honey: data.get("website") || "",
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw Error(
          result.error || "We could not confirm delivery. Please try again.",
        );
      setPreview(result.preview === true);
      setSuccess(intent);
      setShopUrl(result.shopUrl || "");
      trackConversion(
        intent === "discount"
          ? "catalogue_discount_request"
          : "catalogue_discovery_request",
        { catalogue: catalogue.id },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="catalogue-toolbar">
        <div className="catalogue-pagination">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => {
              setPage(page - 1);
              setImageError(false);
            }}
          >
            ← Previous
          </button>
          <label>
            Page{" "}
            <select
              aria-label="Catalogue page"
              value={page}
              onChange={(e) => {
                setPage(Number(e.target.value));
                setImageError(false);
              }}
            >
              {Array.from({ length: catalogue.pages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>{" "}
            of {catalogue.pages}
          </label>
          <button
            type="button"
            disabled={page === catalogue.pages}
            onClick={() => {
              setPage(page + 1);
              setImageError(false);
            }}
          >
            Next →
          </button>
        </div>
        <a href={catalogue.pdf} download>
          Download PDF ({catalogue.size})
        </a>
      </div>
      <div className="catalogue-page-image" aria-live="polite">
        <Image
          key={page}
          src={cataloguePageImage(catalogue.id, page)}
          alt={`${catalogue.title}, page ${page}`}
          width={1600}
          height={1131}
          unoptimized
          priority={page === 1}
          onLoad={() => setLoaded(true)}
          onError={() => setImageError(true)}
        />
        {imageError && (
          <p role="alert">
            This page could not load.{" "}
            <a href={catalogue.pdf}>Open the original PDF</a> or try another
            page.
          </p>
        )}
      </div>
      <div className="catalogue-viewer-actions">
        <button ref={offerButton} type="button" onClick={openOffer}>
          Get 5% off or discuss your project
        </button>
        <Link href="/furniture">Explore our furniture service</Link>
      </div>
      <dialog
        ref={dialog}
        className="catalogue-offer"
        aria-labelledby="catalogue-offer-title"
        onClose={() => offerButton.current?.focus()}
      >
        <div className="catalogue-offer-top">
          <p className="home-eyebrow">Your Office Furniture</p>
          <button
            type="button"
            aria-label="Close catalogue offer"
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
        </div>
        {success ? (
          <div role="status">
            {preview && (
              <p>
                Preview only: your request was checked, but no email was sent.
              </p>
            )}
            <h2 id="catalogue-offer-title">
              {success === "discount"
                ? "Your 5% code is on its way."
                : "Let’s talk about your project."}
            </h2>
            <p>
              {success === "discount"
                ? "Check your inbox for your first-order code and shopping link."
                : "Your session request has been sent. Our team will contact you to arrange a time; no appointment is booked yet."}
            </p>
            {success === "discount" && shopUrl && (
              <a className="home-button home-button-dark" href={shopUrl}>
                Shop with 5% off
              </a>
            )}
            <button
              className="catalogue-continue"
              onClick={() => dialog.current?.close()}
            >
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <h2 id="catalogue-offer-title">
              Make your next step a little easier.
            </h2>
            <p>
              Ready to order? Receive 5% off your first online order. Planning a
              bigger project? Request a Project Discovery Session.
            </p>
            <div className="catalogue-offer-options">
              <button
                type="button"
                aria-pressed={intent === "discount"}
                onClick={() => {
                  setIntent("discount");
                  setError("");
                }}
              >
                Get 5% off
              </button>
              <button
                type="button"
                aria-pressed={intent === "discovery"}
                onClick={() => {
                  setIntent("discovery");
                  setError("");
                }}
              >
                Project Discovery Session
              </button>
            </div>
            <form onSubmit={submit}>
              {intent === "discovery" && (
                <label>
                  Your name
                  <input
                    name="name"
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                </label>
              )}
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </label>
              {intent === "discovery" && (
                <label>
                  What are you planning? (optional)
                  <textarea
                    name="message"
                    maxLength={2000}
                    rows={3}
                    placeholder="Your space, team size or timing"
                  />
                </label>
              )}
              <div hidden>
                <label>
                  Leave blank
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <p className="catalogue-small">
                {intent === "discount"
                  ? CATALOGUE_OFFER_TERMS
                  : "We’ll contact you to understand your project and arrange a suitable session time."}
              </p>
              <p className="catalogue-small">
                We use your details to respond to this request. No ongoing
                marketing subscription.{" "}
                <Link href="/privacy">Privacy policy</Link>.
              </p>
              {error && (
                <p role="alert" className="catalogue-error">
                  {error}
                </p>
              )}
              <button
                className="home-button home-button-dark"
                type="submit"
                disabled={busy}
              >
                {busy
                  ? "Sending…"
                  : intent === "discount"
                    ? "Email me my 5% code"
                    : "Request my discovery session"}
              </button>
            </form>
            <button
              className="catalogue-continue"
              type="button"
              onClick={() => dialog.current?.close()}
            >
              No thanks, keep browsing
            </button>
          </>
        )}
      </dialog>
    </>
  );
}

import { useMemo, useState } from "react";

const TIERS = [
  {
    id: "spotlight",
    name: "Spotlight Donators",
    min: 100,
    max: 500,
    benefits: [
      "Name listed on supporter wall",
      "Name added to selected MaiCinema Originals end credits",
      "Early supporter recognition on the platform",
      "Access to supporter updates for selected projects",
    ],
  },
  {
    id: "premiere",
    name: "Premiere Donators",
    min: 500,
    max: 1000,
    benefits: [
      "Everything in Spotlight",
      "Priority name placement in end credits",
      "Exclusive MaiCinema supporter badge",
      "Early preview updates on selected originals and streams",
      "Special appreciation feature on supporter section",
    ],
  },
  {
    id: "executive",
    name: "Executive Donators",
    min: 1000,
    max: null,
    benefits: [
      "Everything in Premiere",
      "Executive supporter recognition on selected MaiCinema Originals",
      "Featured supporter spotlight on the platform",
      "Priority acknowledgment during special campaigns or premieres",
      "Highest supporter tier recognition on donation section",
    ],
  },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function SupportDonationSection() {
  const [supportTotal, setSupportTotal] = useState(0);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    amount: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTierData = useMemo(
    () => TIERS.find((tier) => tier.id === selectedTier),
    [selectedTier]
  );

  const openForm = (tierId) => {
    setSelectedTier(tierId);
    setShowForm(true);
    setError("");
    setForm({
      fullName: "",
      email: "",
      amount: "",
      message: "",
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedTier(null);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAmount = (amount, tier) => {
    if (!tier) return "Invalid donation tier.";

    const numericAmount = Number(amount);

    if (!numericAmount || Number.isNaN(numericAmount)) {
      return "Please enter a valid amount.";
    }

    if (numericAmount < tier.min) {
      return `Minimum donation for ${tier.name} is ${formatCurrency(tier.min)}.`;
    }

    if (tier.max !== null && numericAmount > tier.max) {
      return `Maximum donation for ${tier.name} is ${formatCurrency(tier.max)}.`;
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTierData) {
      setError("Please choose a donation package.");
      return;
    }

    const amountError = validateAmount(form.amount, selectedTierData);
    if (amountError) {
      setError(amountError);
      return;
    }

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const numericAmount = Number(form.amount);

      /**
       * TEMP SAFE DEMO LOGIC:
       * For now, this only updates the visible support total locally.
       *
       * Later, this is where we will:
       * 1. create a support donation record in a separate table
       * 2. connect payment gateway
       * 3. refresh the total from support donations only
       */
      setSupportTotal((prev) => prev + numericAmount);

      closeForm();
    } catch (err) {
      setError("Something went wrong while processing the donation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] text-white shadow-lg"
      style={{ marginBottom: "32px" }}
    >
      <div className="px-5 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">
              Patron Circle Donators
            </h2>
            <p className="mx-auto max-w-3xl text-sm leading-6 text-white/75 md:text-base">
              Support the journey of <strong>MaiCinema Originals and Streams</strong>.
              Be part of what we are building here by choosing any support package
              below and unlock special supporter benefits.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-[#d4af37]/30 bg-black/40 px-5 py-6 text-center">
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#d4af37]">
              Total Support Raised
            </p>
            <h3 className="text-3xl font-extrabold md:text-5xl">
              {formatCurrency(supportTotal)}
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Every contribution helps support MaiCinema Originals and platform growth.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className="mt-2 text-sm text-[#d4af37]">
                    {tier.max === null
                      ? `${formatCurrency(tier.min)} and above`
                      : `${formatCurrency(tier.min)} – ${formatCurrency(tier.max)}`}
                  </p>
                </div>

                <div className="mb-6 flex-1">
                  <p className="mb-3 text-sm font-semibold text-white/85">
                    Benefits:
                  </p>
                  <ul className="space-y-2 text-sm leading-6 text-white/70">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => openForm(tier.id)}
                  className="mt-auto rounded-xl bg-[#d4af37] px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Payment
                </button>
              </div>
            ))}
          </div>

          {showForm && selectedTierData && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/50 p-5 md:p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">
                    Complete Your Support Payment
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    Selected package:{" "}
                    <span className="font-semibold text-[#d4af37]">
                      {selectedTierData.name}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 hover:bg-white/5"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/80">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/80">
                    Donation Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    min={selectedTierData.min}
                    max={selectedTierData.max ?? undefined}
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none"
                    placeholder={
                      selectedTierData.max === null
                        ? `Minimum ${selectedTierData.min}`
                        : `${selectedTierData.min} - ${selectedTierData.max}`
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/80">
                    Selected Package
                  </label>
                  <input
                    type="text"
                    value={selectedTierData.name}
                    readOnly
                    className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white/60 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-white/80">
                    Support Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none"
                    placeholder="Write a message of support"
                  />
                </div>

                {error && (
                  <div className="md:col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Processing..." : "Pay Now"}
                  </button>

                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
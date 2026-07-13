"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EventCoverFrame } from "@/components/events/event-cover-frame";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { awardUserExp } from "@/lib/exp/award-exp";
import { validateEventCoverFile, type EventCoverValidationCode } from "@/lib/events/cover-image";
import { uploadEventCoverToStorage } from "@/lib/events/upload-event-cover";
import { createClient } from "@/lib/supabase/client";
import { eventFormatLabel, eventRealmOptions } from "@/lib/i18n/taxonomy";

type EventCreateFormProps = {
  userId: string;
};

export function EventCreateForm({ userId }: EventCreateFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const { forms } = useContent();
  const event = forms.event;
  const realmOptions = eventRealmOptions(locale).filter((r) => r.value !== "all");
  const formatOptions = (["online", "offline", "hybrid"] as const).map((value) => ({
    value,
    label: eventFormatLabel(value, locale),
  }));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("meetup");
  const [format, setFormat] = useState<"online" | "offline" | "hybrid">("offline");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [ticketPrice, setTicketPrice] = useState("0");
  const [capacity, setCapacity] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [coverPreviewUrl]);

  function coverErrorMessage(code: EventCoverValidationCode): string {
    switch (code) {
      case "format":
        return event.errCoverFormat;
      case "size":
        return event.errCoverSize;
      case "aspect":
        return event.errCoverAspect;
      case "min_dimensions":
        return event.errCoverMinDimensions;
      default:
        return event.errCoverUpload;
    }
  }

  async function handleCoverChange(file: File | null) {
    setError(null);
    if (coverPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    if (!file) {
      setCoverFile(null);
      setCoverPreviewUrl(null);
      return;
    }

    const result = await validateEventCoverFile(file);
    if (!result.ok) {
      setCoverFile(null);
      setCoverPreviewUrl(null);
      setError(coverErrorMessage(result.code));
      return;
    }

    setCoverFile(file);
    setCoverPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(eventForm: React.FormEvent<HTMLFormElement>) {
    eventForm.preventDefault();
    setError(null);

    if (!startsAt) {
      setError(event.errStartsAt);
      return;
    }

    if ((format === "online" || format === "hybrid") && !onlineUrl.trim()) {
      setError(event.errOnlineUrl);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    let coverImageUrl: string | null = null;
    if (coverFile) {
      try {
        coverImageUrl = await uploadEventCoverToStorage(supabase, userId, coverFile);
      } catch {
        setError(event.errCoverUpload);
        setLoading(false);
        return;
      }
    }

    const { data, error: insertError } = await supabase
      .from("events")
      .insert({
        organizer_id: userId,
        title: title.trim(),
        description: description.trim() || null,
        category,
        format,
        status: "published",
        starts_at: new Date(startsAt).toISOString(),
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
        venue_name: venueName.trim() || null,
        venue_address: venueAddress.trim() || null,
        online_url: onlineUrl.trim() || null,
        ticket_price: Number.parseInt(ticketPrice, 10) || 0,
        capacity: capacity ? Number.parseInt(capacity, 10) : null,
        cover_image_url: coverImageUrl,
      })
      .select("id")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? event.errSave);
      setLoading(false);
      return;
    }

    await awardUserExp(supabase, "event.create", data.id);
    router.push(`/events/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="eldonia-label">{event.title}</label>
        <input id="title" required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} className="eldonia-input" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cover_image" className="eldonia-label">{event.coverImage}</label>
        <input
          id="cover_image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="eldonia-input file:mr-3 file:rounded file:border-0 file:bg-[var(--eldonia-gold)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#1a1208]"
          onChange={(e) => void handleCoverChange(e.target.files?.[0] ?? null)}
        />
        <p className="eldonia-hint text-xs">{event.coverImageHint}</p>
        <p className="eldonia-hint text-xs">{event.coverSafeZone}</p>
        <p className="eldonia-label text-xs">{event.coverPreview}</p>
        <EventCoverFrame src={coverPreviewUrl} variant="preview" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="eldonia-label">{event.description}</label>
        <textarea id="description" rows={4} maxLength={4000} value={description} onChange={(e) => setDescription(e.target.value)} className="eldonia-textarea" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="eldonia-label">{event.category}</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="eldonia-input">
            {realmOptions.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="format" className="eldonia-label">{event.format}</label>
          <select id="format" value={format} onChange={(e) => setFormat(e.target.value as "online" | "offline" | "hybrid")} className="eldonia-input">
            {formatOptions.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="starts_at" className="eldonia-label">{event.startsAt}</label>
          <input id="starts_at" type="datetime-local" required value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="eldonia-input" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="ends_at" className="eldonia-label">{event.endsAt}</label>
          <input id="ends_at" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="eldonia-input" />
        </div>
      </div>
      {(format === "offline" || format === "hybrid") && (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="venue_name" className="eldonia-label">{event.venueName}</label>
            <input id="venue_name" value={venueName} onChange={(e) => setVenueName(e.target.value)} className="eldonia-input" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="venue_address" className="eldonia-label">{event.venueAddress}</label>
            <input id="venue_address" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} className="eldonia-input" />
          </div>
        </>
      )}
      {(format === "online" || format === "hybrid") && (
        <div className="flex flex-col gap-1">
          <label htmlFor="online_url" className="eldonia-label">{event.onlineUrl}</label>
          <input
            id="online_url"
            type="url"
            required={format === "online" || format === "hybrid"}
            value={onlineUrl}
            onChange={(e) => setOnlineUrl(e.target.value)}
            className="eldonia-input"
          />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="ticket_price" className="eldonia-label">{event.ticketPrice}</label>
          <input id="ticket_price" type="number" min={0} value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} className="eldonia-input" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="capacity" className="eldonia-label">{event.capacity}</label>
          <input id="capacity" type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} className="eldonia-input" />
        </div>
      </div>
      {error && <p className="eldonia-alert-error">{error}</p>}
      <button type="submit" disabled={loading} className="eldonia-btn-primary w-fit">
        {loading ? event.submitting : event.submit}
      </button>
    </form>
  );
}

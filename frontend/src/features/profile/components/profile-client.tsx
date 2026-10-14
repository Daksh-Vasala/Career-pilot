"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  UserRound,
  Mail,
  MapPin,
  Phone,
  Code2,
  Globe,
  Pencil,
  X,
  Save,
  LoaderCircle,
} from "lucide-react";

import type {
  UpdateProfileData,
  UserProfile,
} from "@/features/profile/profile.types";
import { updateProfile } from "@/features/profile/profile.service";

interface ProfileClientProps {
  initialProfile: UserProfile;
}

interface ProfileForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  location: string;
  bio: string;
}

function getFormValues(profile: UserProfile): ProfileForm {
  return {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    phoneNumber: profile.profile?.phoneNumber ?? "",
    linkedinUrl: profile.profile?.linkedinUrl ?? "",
    githubUrl: profile.profile?.githubUrl ?? "",
    portfolioUrl: profile.profile?.portfolioUrl ?? "",
    location: profile.profile?.location ?? "",
    bio: profile.profile?.bio ?? "",
  };
}

const inputClass =
  "surface-inset w-full rounded-lg px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={inputClass}
      />
    </label>
  );
}

export function ProfileClient({ initialProfile }: ProfileClientProps) {
  const router = useRouter();

  const [profile, setProfile] = useState(initialProfile);
  const [form, setForm] = useState<ProfileForm>(() =>
    getFormValues(initialProfile),
  );
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateField = <K extends keyof ProfileForm>(
    key: K,
    value: ProfileForm[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const startEditing = () => {
    setForm(getFormValues(profile));
    setEditing(true);
  };

  const discardChanges = () => {
    setForm(getFormValues(profile));
    setEditing(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.firstName.trim().length < 2) {
      toast.error("First name must be at least 2 characters");
      return;
    }

    if (form.lastName.trim().length < 2) {
      toast.error("Last name must be at least 2 characters");
      return;
    }

    if (
      form.phoneNumber.trim() &&
      !/^[0-9]{10}$/.test(form.phoneNumber.trim())
    ) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    const optionalFields = [
      "phoneNumber",
      "linkedinUrl",
      "githubUrl",
      "portfolioUrl",
      "location",
      "bio",
    ] as const;

    const payload: UpdateProfileData = {};

    if (form.firstName.trim() !== profile.firstName) {
      payload.firstName = form.firstName.trim();
    }

    if (form.lastName.trim() !== profile.lastName) {
      payload.lastName = form.lastName.trim();
    }

    for (const key of optionalFields) {
      const nextValue = form[key].trim();
      const previousValue = profile.profile?.[key] ?? null;

      if (nextValue !== (previousValue ?? "")) {
        payload[key] = nextValue || null;
      }
    }

    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      setEditing(false);
      return;
    }

    setSaving(true);

    try {
      const updatedProfile = await updateProfile(payload);
      setProfile(updatedProfile);
      setForm(getFormValues(updatedProfile));
      setEditing(false);
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Could not update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || "Your name";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information and professional presence.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={startEditing}
            className="button-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>

      <section className="surface-raised rounded-2xl p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRound size={30} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">{fullName}</h2>
            <p className="mt-1 break-all text-sm text-muted-foreground">
              {profile.email}
            </p>
            {profile.profile?.location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={15} />
                {profile.profile.location}
              </p>
            )}
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="surface-raised rounded-2xl p-5 sm:p-7">
          <div className="mb-5">
            <h2 className="font-semibold">Personal information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your name and contact details.
            </p>
          </div>

          {editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="First name"
                value={form.firstName}
                onChange={(value) => updateField("firstName", value)}
                maxLength={50}
                placeholder="First name"
              />
              <Field
                label="Last name"
                value={form.lastName}
                onChange={(value) => updateField("lastName", value)}
                maxLength={50}
                placeholder="Last name"
              />
              <Field
                label="Email address"
                value={profile.email}
                onChange={() => {}}
                type="email"
              />
              <Field
                label="Phone number"
                value={form.phoneNumber}
                onChange={(value) => updateField("phoneNumber", value)}
                type="tel"
                maxLength={10}
                placeholder="10-digit phone number"
              />
              <div className="sm:col-span-2">
                <Field
                  label="Location"
                  value={form.location}
                  onChange={(value) => updateField("location", value)}
                  maxLength={150}
                  placeholder="City, country"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <ReadOnlyField
                icon={<UserRound size={17} />}
                label="Full name"
                value={fullName}
              />
              <ReadOnlyField
                icon={<Mail size={17} />}
                label="Email address"
                value={profile.email}
              />
              <ReadOnlyField
                icon={<Phone size={17} />}
                label="Phone number"
                value={profile.profile?.phoneNumber}
              />
              <ReadOnlyField
                icon={<MapPin size={17} />}
                label="Location"
                value={profile.profile?.location}
              />
            </div>
          )}
        </section>

        <section className="surface-raised rounded-2xl p-5 sm:p-7">
          <div className="mb-5">
            <h2 className="font-semibold">Professional presence</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Links recruiters can use to learn more about your work.
            </p>
          </div>

          {editing ? (
            <div className="grid gap-4">
              <Field
                label="LinkedIn URL"
                value={form.linkedinUrl}
                onChange={(value) => updateField("linkedinUrl", value)}
                type="url"
                placeholder="https://linkedin.com/in/username"
              />
              <Field
                label="GitHub URL"
                value={form.githubUrl}
                onChange={(value) => updateField("githubUrl", value)}
                type="url"
                placeholder="https://github.com/username"
              />
              <Field
                label="Portfolio URL"
                value={form.portfolioUrl}
                onChange={(value) => updateField("portfolioUrl", value)}
                type="url"
                placeholder="https://yourportfolio.com"
              />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <ReadOnlyLink
                icon={<Globe size={17} />}
                label="LinkedIn"
                value={profile.profile?.linkedinUrl}
              />
              <ReadOnlyLink
                icon={<Code2 size={17} />}
                label="GitHub"
                value={profile.profile?.githubUrl}
              />
              <ReadOnlyLink
                icon={<Globe size={17} />}
                label="Portfolio"
                value={profile.profile?.portfolioUrl}
              />
            </div>
          )}
        </section>

        <section className="surface-raised rounded-2xl p-5 sm:p-7">
          <div className="mb-5">
            <h2 className="font-semibold">About me</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Introduce yourself and summarize your professional goals.
            </p>
          </div>

          {editing ? (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Bio</span>
              <textarea
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                maxLength={1000}
                rows={5}
                placeholder="Write a short professional introduction..."
                className={`${inputClass} resize-y`}
              />
              <span className="block text-right text-xs text-muted-foreground">
                {form.bio.length}/1000
              </span>
            </label>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {profile.profile?.bio || "No bio added yet."}
            </p>
          )}
        </section>

        {editing && (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={discardChanges}
              disabled={saving}
              className="surface-raised rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              <span className="inline-flex items-center gap-2">
                <X size={16} />
                Discard
              </span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="button-primary inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function ReadOnlyField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 wrap-break-word text-sm font-medium">
          {value || "Not added"}
        </p>
      </div>
    </div>
  );
}

function ReadOnlyLink({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">Not added</p>
        )}
      </div>
    </div>
  );
}

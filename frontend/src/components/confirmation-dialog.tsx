"use client";

import { Dialog } from "@base-ui/react/dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
  variant?: "default" | "destructive";
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  isPending = false,
  variant = "destructive",
}: ConfirmationDialogProps) {
  const confirmClassName =
    variant === "destructive"
        ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive"
      : "bg-primary text-primary-foreground hover:opacity-90 focus-visible:ring-primary";

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) onOpenChange(nextOpen);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-60 bg-black/45 backdrop-blur-sm" />
        <Dialog.Popup
          className="fixed left-1/2 top-1/2 z-61 w-[calc(100%-2rem)] max-w-md
            -translate-x-1/2 -translate-y-1/2 surface-modal p-6
            text-card-foreground"
        >
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            {description}
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close
              disabled={isPending}
              className="rounded-xl border border-border px-4 py-2 text-sm
                font-medium transition-colors hover:bg-muted
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-ring disabled:cursor-not-allowed
                disabled:opacity-50"
            >
              Cancel
            </Dialog.Close>
            <button
              type="button"
              disabled={isPending}
              onClick={onConfirm}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-offset-2 disabled:cursor-not-allowed
                disabled:opacity-50 ${confirmClassName}`}
            >
              {isPending ? "Please wait..." : confirmLabel}
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

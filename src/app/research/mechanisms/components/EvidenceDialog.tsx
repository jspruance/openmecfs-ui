"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Mechanism } from "../data";

interface Props {
  mech: Mechanism;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function EvidenceDialog({ mech, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-lg 
          rounded-xl 
          bg-white dark:bg-slate-900 
          border border-slate-200 dark:border-slate-700
          shadow-2xl 
          p-6
        "
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-2xl">{mech.icon}</span>
            {mech.title} — Evidence
          </DialogTitle>
          <DialogDescription>
            Key research signals supporting this mechanism.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          {mech.papers && mech.papers.length > 0 ? (
            mech.papers.map((p) => (
              <div
                key={p}
                className="
                  flex items-center gap-2 
                  text-sm 
                  p-2 
                  rounded-md 
                  border 
                  bg-slate-50 dark:bg-slate-800 
                  text-slate-700 dark:text-slate-300 
                  border-slate-200 dark:border-slate-700
                "
              >
                📄 {p}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No papers linked yet — coming soon.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

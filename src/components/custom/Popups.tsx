"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useAuthStore } from "@/store/authStore";
import { PopUp } from "@/types/popup";
import { getActivePopUps } from "@/actions/popups";
import { usePopUpStore } from "@/store/showPopUps";
import { DialogTitle } from "@radix-ui/react-dialog";

export function PopupCarousel() {
  const [popups, setPopups] = useState<PopUp[]>([]);
  const [currentPopup, setCurrentPopup] = useState(0);
  const { canShow, setCanShow } = usePopUpStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (canShow) {
      const fetchPopups = async () => {
        const res = await getActivePopUps(token);
        setPopups(res || []);
      };
      fetchPopups();
    }
  }, [token, canShow]);

  const handleNextPopup = () => {
    setCurrentPopup((prev) => (prev + 1) % popups.length);
  };

  const handlePreviousPopup = () => {
    setCurrentPopup((prev) => (prev - 1 + popups.length) % popups.length);
  };

  const handleClose = () => {
    setCanShow(false);
  };

  if (popups.length === 0 || !canShow) {
    return null; // No mostrar nada si no hay popups o si ya fueron cerrados
  }

  return (
    <Dialog open={canShow} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg text-center">
        {popups.length > 0 && (
          <div>
            <DialogTitle className="text-xl font-bold mb-4">
              {popups[currentPopup].Title}
            </DialogTitle>
            <Button asChild>
              <a
                href={popups[currentPopup].Url}
                rel="noopener noreferrer"
              >
                {popups[currentPopup].ButtonText}
              </a>
            </Button>
          </div>
        )}
        <DialogFooter className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handlePreviousPopup}
            disabled={popups.length <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={handleNextPopup}
            disabled={popups.length <= 1}
          >
            Siguiente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

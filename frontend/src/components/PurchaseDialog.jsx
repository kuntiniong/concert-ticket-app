import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function PurchaseDialog({ isOpen, setIsOpen, concert, handleBook }) {
  // state management 
  const [purchaseStatus, setPurchaseStatus] = useState(null); // for system message
  const [quantity, setQuantity] = useState(1);

  const resetState = () => {
    setPurchaseStatus(null);
    setQuantity(1);
  };

  // reset when a purchase is successful (the window is closed)
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  // handle the preconditions like the controller at the backend
  const isConcertDateValid = () => {
    const concertDate = new Date(concert.concertDateTime);
    const currentDate = new Date();
    return concertDate > currentDate;
  };

  const isAvailable = () => {
    return concert.availableTickets >= quantity;
  };

  const confirmPurchase = async () => {
    if (!isConcertDateValid()) {
      setPurchaseStatus("Cannot purchase tickets for a past concert.");
      return;
    }

    if (!isAvailable()) {
      setPurchaseStatus("Not enough tickets available.");
      return;
    }

    try {
      // call the passed func to update the backend and state
      await handleBook(concert.documentId, quantity);

      setPurchaseStatus(`${quantity} ticket(s) purchased successfully!`);
      concert.availableTickets -= quantity; //  update locally (before the dialog is closed)
    
      // close the dialog after success
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      setPurchaseStatus("Failed to complete the purchase. Try again.");
    }
  };

  // onChange func for quantity input box -> passing int explicitly & apply quantity limits for programmatic control
  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value, 10);
    setQuantity(Math.max(1, Math.min(10, value)));
  }

  const totalPrice = concert ? concert.price * quantity : 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetState();
      }} // reset when closing the dialog manually
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
        </DialogHeader>

        {concert && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-right font-medium">Concert:</span>
              <div id="concert" className="col-span-2">
                {concert.name}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-right font-medium">Date:</span>
              <div id="date" className="col-span-2">
                {concert.concertDateTime}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-right font-medium">Venue:</span>
              <div id="venue" className="col-span-2">
                {concert.venue}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-right font-medium">Available Tickets:</span>
              <div id="availableTickets" className="col-span-2">
                {concert.availableTickets}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-right font-medium">Quantity:</span>
              <Input
                id="quantity"
                className="col-span-2"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1" // limits for ux
                max="10" 
              />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-right font-medium">Total Price:</span>
              <div id="price" className="col-span-2">
                ${totalPrice}
              </div>
            </div>
          </div>
        )}

        {/* system message for purchasing status */}
        {purchaseStatus && <div className="py-2 text-600 font-semibold">{purchaseStatus}</div>}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmPurchase} disabled={!!purchaseStatus}>
            {purchaseStatus ? "Purchased" : "Confirm Purchase"} {/* btn text */}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}

export default PurchaseDialog;
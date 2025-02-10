import { useState, useEffect } from "react";
import ConcertCard from "./ConcertCard";
import PurchaseDialog from "./PurchaseDialog";
import dummyConcerts from "../testing/dummyConcerts.js";
import { fetchConcerts, book } from "../service/api.js";

function ConcertGrid() {
  const [concerts, setConcerts] = useState(dummyConcerts); // dynamic updates for concerts
  const [selectedConcert, setSelectedConcert] = useState(null); // pass the selected concert to dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false); // dialog popups when the button in concert card is pressed

  const handlePurchase = (concert) => { // pass as a func prop
    setSelectedConcert(concert);
    setIsDialogOpen(true);
  };

  // update concert data in state and backend
  const handleBook = async (documentId, requestedQuantity) => {
    try {
      const updatedConcert = await book(documentId, requestedQuantity);
  
      // update the state with the updated concert
      setConcerts((prevConcerts) =>
        prevConcerts.map((concert) =>
          concert.documentId === documentId
            ? { ...concert, availableTickets: concert.availableTickets - requestedQuantity}
            : concert // update the quantity after making the purchase (without re-rendering)
        )
      );
      console.log("Concert updated successfully:", updatedConcert);
    } catch (error) {
      console.error("Error updating concert:", error);
    }
  };
 
  useEffect(() => {
    const fetchConcertsData = async () => {
      const allConcerts = await fetchConcerts();
      setConcerts(allConcerts.data);
    };

    fetchConcertsData();
  }, []); // empty array -> runs only once (e.g. it won't re-render the cards if i open a dialog/ state changes)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concerts.map((concert) => (
          <ConcertCard key={concert.id} concert={concert} onPurchase={handlePurchase} />
        ))}
      </div>
      <PurchaseDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        concert={selectedConcert}
        handleBook={handleBook} // pass the update function as a prop to dialog
      />
    </>
  );
}

export default ConcertGrid;
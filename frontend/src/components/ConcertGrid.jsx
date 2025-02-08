import { useState } from "react"
import ConcertCard from "./ConcertCard"
import PurchaseDialog from "./PurchaseDialog"
import dummyConcerts from "../testing/dummyConcerts.js"

function ConcertGrid() {
  const [concerts] = useState(dummyConcerts) // for dynamic update from api calls
  const [selectedConcert, setSelectedConcert] = useState(null) // pass the selected concert to dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false) // dialog popups when the button in concert card is pressed

  const handlePurchase = (concert) => { // pass as a func prop
    setSelectedConcert(concert)
    setIsDialogOpen(true)
  }

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
        concert={selectedConcert} />
    </>
  );
}

export default ConcertGrid


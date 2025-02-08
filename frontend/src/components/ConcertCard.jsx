import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function ConcertCard({ concert, onPurchase }) {
  return (
    (<Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{concert.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4">{concert.description}</p>
        <p>Date: {concert.concertDateTime}</p>
        <p className="mb-2">Venue: {concert.venue}</p>
        <p>Price: ${concert.price}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onPurchase(concert)} className="w-full">
          Book Now
        </Button>
      </CardFooter>
    </Card>)
  );
}

export default ConcertCard


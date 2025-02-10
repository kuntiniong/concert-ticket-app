import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function ConcertCard({ concert, onPurchase }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{concert.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4">{concert.description}</p>
        <p>
          <strong>Date:</strong> {concert.concertDateTime.split("T")[0]}
        </p>
        <p className="mb-2">
          <strong>Venue:</strong> {concert.venue}
        </p>
        <p>
          <strong>Price:</strong> ${concert.price}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onPurchase(concert)} className="w-full">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ConcertCard


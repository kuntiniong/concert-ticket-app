import ConcertGrid from "./components/ConcertGrid"

function App() {
  return (
    (<div className="container mx-auto pt-2 pb-8">
      {
      <h1 className="text-3xl font-bold mb-8 pt-5">Upcoming Cantopop Concerts</h1>
      }
      <ConcertGrid />
    </div>)
  );
}

export default App

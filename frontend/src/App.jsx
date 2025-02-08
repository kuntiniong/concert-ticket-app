import ConcertGrid from "./components/ConcertGrid"

function App() {
  return (
    (<div className="container mx-auto pt-2 pb-8">
      <div className="flex items-center">
        <img src="/favicon.png" className="w-16 h-16 object-cover mr-4"></img>
        <h1 className="text-3xl font-bold mb-8 pt-5">Upcoming Cantopop Concerts</h1>
      </div>
      <ConcertGrid />
    </div>)
  );
}

export default App

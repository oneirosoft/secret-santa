import { Button } from "@secret-santa/ui";
import "./index.css";

export function Home() {
  return (
    <div className="app">
      <div className="snow" aria-hidden="true" />
      <h1>Secret Santa</h1>
      <p>
        Already have a workshop code? Enter it here!
      </p>
      <input
        type="text"
        placeholder="Enter workshop code"
        className="workshop-input"
      />
      <Button variant="primary" onClick={() => console.log('Join Existing Workshop')}>
        Join Existing Workshop
      </Button>
      <p>
        Or create a new workshop!
      </p>
      <Button variant="primary" onClick={() => console.log('Create New Workshop')}>
        Create New Workshop
      </Button>
    </div>
  );
}

export default Home;

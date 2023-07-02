import { createRoot } from 'react-dom/client';


const rootNode = document.getElementById('root')


const root = createRoot(rootNode)
const Home = () => <span data-testid="root">Client code</span> 

root.render(<Home />)

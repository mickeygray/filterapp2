import LeadState from './context/lead/LeadState'
import "./App.css";
import NewUpload from './components/NewUpload';
import ListViewer from './components/ListViewer';
import SuppressUpload from './components/SuppressUpload';





const App = () => {
  return (
    <LeadState>
      <div>
      <div className='grid-2'>
        <div>
        <NewUpload/>
          </div> 
        <div>
        <SuppressUpload/>
        </div>
      </div>
      <div>
        <ListViewer/>
      </div>
      </div>
    </LeadState>
  )
}

export default App



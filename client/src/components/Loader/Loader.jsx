import { DNA } from 'react-loader-spinner';
import "./Loader.scss";

const Loader = () => {
  return (
    <div className='loader-container'>
      <DNA
        isVisible={true}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  )
}

export default Loader
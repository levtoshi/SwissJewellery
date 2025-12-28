import { DNA } from 'react-loader-spinner'

const Loader = () => {
  return (
    <DNA
      isVisible={true}
      height="80"
      width="80"
      ariaLabel="dna-loading"
      wrapperStyle={{}}
      wrapperClass="dna-wrapper"
    />
  )
}

export default Loader
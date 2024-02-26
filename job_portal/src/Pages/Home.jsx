import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Card from "../components/Card";
import Sidebar from "../sidebar/Sidebar";


const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const itemsPerPage = 3;


  useEffect(() => {
    setIsLoading(true);
    fetch("jobs.json").then(res => res.json()).then(data => {
      setJobs(data)
      setIsLoading(false);
    })
  }, [])

  const searchInputChange = (event) => setQuery(event.target.value);
  const selectCategory = (event) => setSelectedCategory(event.target.value)
  const handleClick = (event) => setSelectedCategory(event.target.value)

  //filter jobs by title
  // const filteredItems= jobs.filter((job)=> job.jobTitle.toLowerCase().indexOf(query.toLowerCase())!==-1);

  const filterData = (jobs, category, query) => {
    let filteredJobs = jobs;

    if (query) {
      filteredJobs = jobs.filter((job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1);;
    }

    if (category) {
      filteredJobs = filteredJobs.filter(({ jobLocation, maxPrice, experienceLevel, salaryType, employmentType, postingDate }) => (
        jobLocation.toLowerCase() === category.toLowerCase() // ||
        // parseInt(maxPrice) <= parseInt(category) ||
        // salaryType.toLowerCase() === category.toLowerCase() ||
        // employmentType.toLowerCase() === category.toLowerCase()
      ));
    }

    return filteredJobs;
  }

  const result = filterData(jobs, selectedCategory, query);

  const calculatePageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  }

  //function for pagination
  const pagedData = (result) => {
    const { startIndex, endIndex } = calculatePageRange();
    return result.slice(startIndex, endIndex);
  }

  const finalResult = pagedData(result);

  //Function for next page
  const nextPage = () => {
    if (currentPage < Math.ceil(result.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  }

  //Function for previous page
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <div >
      <Banner query={query} handleInputChange={searchInputChange} />
      {/* Main Content */}
      <div className="bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12">
        {/* Left side */}
        <div className="bg-white p-4 rounded">
          <Sidebar handleChange={selectCategory} handleClick={handleClick} />
        </div>

        {/* Job cards */}
        <div className="col-span-2 bg-white p-4 rounded-sm">
          {
            isLoading ?
              (<p className="font-medium">Loading....</p>) :
              result.length > 0 ? (
                <div>
                  <h3 className="text-lg font-bold mb-2">{result.length} Jobs</h3>
                  {finalResult.map((data, i) => <Card key={i} data={data} />)}
                </div>
              ) :
                <>
                  <h3 className="text-lg font-bold mb-2">{finalResult.length} Jobs</h3>
                  <p>No Data Found!</p>
                </>
          }

          {/* Pagination here */}
          {
            result.length > 0 ? (
              <div className="flex justify-center mt-4 space-x-8">
                <button onClick={previousPage}>Previous</button>
                {/* {console.log(filteredItems.length, itemsPerPage)} */}
                <span>Page {currentPage} of {Math.ceil(result.length / itemsPerPage)}</span>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(result.length / itemsPerPage)} className="hover:underline">Next</button>
              </div>
            ) : ""
          }

        </div>

        {/* Right Side */}
        <div className="bg-white p-4 rounded">Right</div>
      </div>
    </div>
  )
}

export default Home

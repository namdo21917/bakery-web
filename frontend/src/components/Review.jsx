import Star from "./Star";

function Review() {
  return (
    <>
      <div className="border rounded py-2 px-3 mb-3 me-4" style={{width: '300px'}}>
        <p className="mb-1">
          <Star st={4} />
          <span className="text-secondary ms-2">4/5</span>
        </p>
        <p className="fw-bold mb-1">Ngọc Huyền</p>
      </div>
    </>
  );
}

export default Review;

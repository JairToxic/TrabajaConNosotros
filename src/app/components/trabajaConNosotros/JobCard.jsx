import Image from 'next/image';

const JobCard = () => {
  return (
    <div className="job-card">
      <div className="icon-placeholder">
        <Image src="/tarjeta.png" alt="Icono" width={100} height={100} />
      </div>
      <h3 className="job-title">Junior Developer</h3>
      <p className="job-location">📍 Quito, Ecuador</p>
      <p className="job-type">💼 Full-Time</p>
      <p className="job-date">Publicado el 3-12-2024</p>

      <style jsx>{`
        .job-card {
          background-color: #d9d9d9;
          padding: 20px;
          width: 240px;
          text-align: center;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .icon-placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
        }
        .job-title,
        .job-location,
        .job-type,
        .job-date {
          color: #000000;
          margin: 8px 0;
        }
        @media (min-width: 768px) {
          .job-card {
            width: 300px;
            padding: 25px;
          }
        }
        @media (min-width: 1200px) {
          .job-card {
            width: 350px;
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default JobCard;

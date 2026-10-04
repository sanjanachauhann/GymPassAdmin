// import "./ApplicationDrawer.css";

// export default function ApplicationDrawer({  gym,
//     onClose,
//     onApprove,
//     onReject, }) {

//     if (!gym) return null;

    

//     return (

//         <>
//             <div className="drawer-overlay" onClick={onClose} />

//             <div className="drawer">

//                 <div className="drawer-header">

//                     <p>{gym.gymName}</p>

//                     <button onClick={onClose}>
//                         ✕
//                     </button>

//                 </div>

//                 <div className="drawer-section">

//                     <p>{gym.owner}</p>
//                     <div className="drawer-section">
//                      <h3>Name</h3>
//                     <p>{gym.ownerName}</p>
//                     </div>
//                      <div className="drawer-section">
// <h3>Phone</h3>
// <p>{gym.phone}</p>
// </div>
//  <div className="drawer-section">
// <h3>Email</h3>
// <p>{gym.email}</p>
// </div>

//                 </div>

//                 <div className="drawer-section">

//                     <h3>Address</h3>

//                     <p>{gym.address}</p>

//                 </div>

//              <div className="drawer-section">

// <h3>Membership Plans</h3>

// <div className="plan">
// Daily
// <span>₹{gym.passes.daily}</span>
// </div>

// <div className="plan">
// Weekly
// <span>₹{gym.passes.weekly}</span>
// </div>

// <div className="plan">
// Monthly
// <span>₹{gym.passes.monthly}</span>
// </div>

// <div className="plan">
// Yearly
// <span>₹{gym.passes.yearly}</span>
// </div>

// </div>

//    <div className="drawer-buttons">

// <button
// className="reject"
// onClick={() => onReject(gym._id)}
// >
// Reject
// </button>

// <button
// className="approve"
// onClick={() => onApprove(gym._id)}
// >
// Approve Gym
// </button>

// </div>

//             </div>

//         </>

//     );

// }

import "./ApplicationDrawer.css";

export default function ApplicationDrawer({
  gym,
  onClose,
  onApprove,
  onReject,
  processingAction,
}) {
  if (!gym) return null;

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={() => {
          if (!processingAction) {
            onClose();
          }
        }}
      />

      <div className="drawer">

        <div className="drawer-header">
          <p>{gym.gymName}</p>

          <button
            onClick={onClose}
            disabled={processingAction !== null}
          >
            ✕
          </button>
        </div>

        <div className="drawer-section">

          <p>{gym.owner}</p>

          <div className="drawer-section">
            <h3>Name</h3>
            <p>{gym.ownerName}</p>
          </div>

          <div className="drawer-section">
            <h3>Phone</h3>
            <p>{gym.phone}</p>
          </div>

          <div className="drawer-section">
            <h3>Email</h3>
            <p>{gym.email}</p>
          </div>

        </div>

        <div className="drawer-section">

          <h3>Address</h3>

          <p>{gym.address}</p>

        </div>

        <div className="drawer-section">

          <h3>Membership Plans</h3>

          <div className="plan">
            Daily
            <span>₹{gym.passes?.daily ?? "-"}</span>
          </div>

          <div className="plan">
            Weekly
            <span>₹{gym.passes?.weekly ?? "-"}</span>
          </div>

          <div className="plan">
            Monthly
            <span>₹{gym.passes?.monthly ?? "-"}</span>
          </div>

          <div className="plan">
            Yearly
            <span>₹{gym.passes?.yearly ?? "-"}</span>
          </div>

        </div>

        <div className="drawer-buttons">

          <button
            className="reject"
            onClick={() => onReject(gym._id)}
            disabled={processingAction !== null}
          >
            {processingAction === "reject" ? (
              <>
                <span className="loader"></span>
                Rejecting...
              </>
            ) : (
              "Reject"
            )}
          </button>

          <button
            className="approve"
            onClick={() => onApprove(gym._id)}
            disabled={processingAction !== null}
          >
            {processingAction === "approve" ? (
              <>
                <span className="loader"></span>
                Approving...
              </>
            ) : (
              "Approve Gym"
            )}
          </button>

        </div>

      </div>
    </>
  );
}
export default function AddWorkoutModal({
  children,
  isOpen,
  handleClose,
}: {
  children: any;
  isOpen: boolean;
  handleClose: () => void;
}) {
  if (!isOpen) return null;

  // This is where we will use a portal
  // Return two divs within that portal, the actual modal with the children inside, and the background 1/2 opacity div
  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Add Workout</h1>
      <div>Create some fields to fill out</div>
    </div>
  );
}

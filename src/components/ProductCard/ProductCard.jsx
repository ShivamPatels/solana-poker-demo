export const ProductCard = ({ data }) => {
  return (
    <div className="">
      <div className="relative h-screen lg:max-h-64 max-h-40">
        <div className="absolute inset-0 overflow-hidden rounded-t-lg">
          <img src={data?.image} className="object-cover w-full h-full" />
        </div>
      </div>
      <div className="lg:px-6 px-4 py-4 text-sm">
        <div className="flex gap-8 justify-between mb-4">
          <div>
            <p className="opacity-70">{data?.name}</p>
            <p className="font-semibold uppercase">{data?.symbol}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{data?.description}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end lg:px-6 px-4 pb-3">
      <button className=" text-sm items-center">
        <i className="fas fa-fire mr-2"></i>Burn for 1 PPToken
      </button>
      </div>
    </div>
  )
}

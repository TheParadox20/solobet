export default function Gamers({data}) {
    return(
        <div className="bg-primary-base rounded-md">
            <div className="p-2">
                <div className="flex gap-3 mb-4">
                    <img className="rounded-lg w-16 h-20" src={data.thumbnail} alt="" />
                    <div className="flex flex-col">
                        <p className="font-semibold">{data.title}</p>
                        <p className="font-extralight">{data.devices}</p>
                    </div>
                </div>
                <p className="font-light">Begins at {data.start}</p>
                <p className="my-3 font-semibold">Prizes: {data.prizes}</p>
                <div className="flex justify-between">
                    <p className="">Entry Fee: <span className="font-semibold text-primary-light">KSH {data.fee}</span></p>
                    <p className="">Seats: <span className="font-semibold text-primary-light">{data.seats}</span></p>
                </div>
            </div>
            <button className="w-full rounded-b-md bg-primary-light font-semibold py-3 mt-5">Join Tournament</button>
        </div>
    )
}

export function Yes({id, classname}){
    return <button className={`bg-primary-light ${classname}`}>Yes</button>
}

export function No({id, classname}){
    return <button className={`bg-Error ${classname}`}>No</button>
}

export default function Prediction({data}) {
    return(
        <div className="bg-primary-base rounded-md p-2 relative">
            <div className="flex gap-3 mb-4">
                <img src={data.thumbnail} className="rounded-full w-12 h-12" alt="" />
                <p className="font-semibold text-lg">{data.title}</p>
            </div>
            {
                data.options?
                <div className="overflow-y-auto max-h-[12vh] pr-4">
                    {
                        data.options.map((option,i)=>{
                            return(
                                <div key={i} className="flex justify-between mb-2 items-center">
                                    <p className="font-semibold">{option.name}</p>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">{option.percentage}%</span>
                                        <Yes classname={'py-1 px-3 font-semibold rounded-md'}/>
                                        <No  classname={'py-1 px-3 font-semibold rounded-md'}/>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                :
                <div className="flex gap-3 mt-10">
                    <Yes classname={'block w-full py-1 font-semibold rounded-md'}/>
                    <No  classname={'block w-full py-1 font-semibold rounded-md'}/>
                </div>
            }
            <div className="flex justify-between sticky w-full bottom-0 pt-4">
                <div>Total Stakes: <span className="font-semibold text-primary-light">KES {data.stakes}</span></div>
                <div className="flex items-center gap-1">
                    <span className="w-6 h-6 icon-[basil--comment-outline]"/>
                    {data.chats}
                </div>
            </div>
        </div>
    )
}
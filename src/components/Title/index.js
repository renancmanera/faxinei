import './title.css';

export default function Title({ children, nome }){
  return(
    <div className="title">
      {children}
      <span>{nome}</span>
    </div>
  )
}
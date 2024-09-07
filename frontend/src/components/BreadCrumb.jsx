import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

function BreadCrumb(props) {
  return (
    <Breadcrumb aria-label="Default breadcrumb example">

        {props.crumbItem.map((data,index) =>(
                    <Breadcrumb.Item key={index} href={data.link}>
                    {data.title}
                    </Breadcrumb.Item>
        ))}
   

    </Breadcrumb>

  );

}

export default BreadCrumb
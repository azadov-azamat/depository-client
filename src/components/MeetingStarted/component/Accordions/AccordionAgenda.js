import React from "react";
import {Button, Card, CardBody, CardHeader, Collapse} from "reactstrap";
import PropTypes from "prop-types";

export class AccordionAgenda extends React.Component {
    state = {
        open: this.props.open
    };

    toggleSection = index => () => {
        this.setState(({open}) => ({
            open: index === open ? undefined : index
        }));
    };

    render() {
        return (
            <div className="accordion">
                {React.Children.map(this.props.children, (child, index) => {
                    if (child.type !== AccordionItem) return null;
                    return React.cloneElement(child, {
                        isOpen: child.props.open || this.state.open === index,
                        onClick: this.toggleSection(index)
                    });
                })}
            </div>
        );
    }
}

AccordionAgenda.propTypes = {
    open: PropTypes.number
};

const AccordionItem = ({children, isOpen, onClick}) => (
    <Card className='mb-2'>
        {React.Children.map(children, child => {
            if (child.type === AccordionHeader) {
                return React.cloneElement(child, {onClick});
            }

            if (child.type === AccordionBody) {
                return React.cloneElement(child, {isOpen});
            }

            return null;
        })}
    </Card>
);

const AccordionHeader = ({children, onClick, status}) => (
    <CardHeader style={{background: '#fff'}}>
        <div className="mb-0 d-flex justify-content-start align-items-center">
            <Button style={{background: '#132E85'}} className='create' onClick={onClick}>+</Button>
            <text className='mx-2'>{children}</text>
        </div>
    </CardHeader>
);

const AccordionBody = ({children, isOpen}) => (
    <Collapse isOpen={isOpen}>
        <CardBody>{children}</CardBody>
    </Collapse>
);

AccordionAgenda.Item = AccordionItem;
AccordionAgenda.Header = AccordionHeader;
AccordionAgenda.Body = AccordionBody;

import React from "react";
import {Card, CardBody, CardHeader, Collapse} from "reactstrap";
import PropTypes from "prop-types";
import Text from "antd/es/typography/Text";

export class AccordionQuestion extends React.Component {
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

AccordionQuestion.propTypes = {
    open: PropTypes.number
};

const AccordionItem = ({children, isOpen, onClick}) => (
    <Card className="mb-2">
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

const AccordionHeader = ({children, onClick}) => (
    <CardHeader>
        <div className="mb-0 d-flex justify-content-between">
            <Text>
                {children}
            </Text>
            <button className='btn create px-3'
                    onClick={onClick}>
                Taxrirlash
            </button>
        </div>
    </CardHeader>
);

const AccordionBody = ({children, isOpen}) => (
    <Collapse isOpen={isOpen}>
        <CardBody>{children}</CardBody>
    </Collapse>
);

AccordionQuestion.Item = AccordionItem;
AccordionQuestion.Header = AccordionHeader;
AccordionQuestion.Body = AccordionBody;

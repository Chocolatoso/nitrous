import PropTypes from 'prop-types';
import React from 'react';
import SvgImage from 'app/components/elements/SvgImage';
import { APP_ICON } from 'app/client_config';
import { ADMINS } from 'shared/constants';

export const AuthorIcon = ({ author }) => {
    if (ADMINS.indexOf(author) === -1) {
        return null;
    }

    return (
        <span>
            {' '}
            <SvgImage
                name={APP_ICON}
                width="25px"
                height="15px"
                className="author-icon"
            />
        </span>
    );
};

AuthorIcon.propTypes = {
    author: PropTypes.string.isRequired,
};

export default AuthorIcon;

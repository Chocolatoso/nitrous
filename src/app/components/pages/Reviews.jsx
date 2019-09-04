import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { actions as movieActions } from 'app/redux/MovieReducer';
import { TAG_LIST } from 'app/client_config';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import * as CustomUtil from 'app/utils/CustomUtil';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';

import Avatar from '@material-ui/core/Avatar';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import TextField from '@material-ui/core/TextField';

import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';

import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
    },
    formControl: {
        marginRight: theme.spacing(1),
        minWidth: '90px',
    },
    card: {
        display: 'flex',
    },
    cardGrid: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    cardDetails: {
        flex: 1,
    },
    cardDate: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    cardMedia: {
        width: 160,
    },
    avatar: {
        margin: theme.spacing(0, 1),
        width: 25,
        height: 25,
    },
    ratingBox: {
        margin: 0,
    },
    button: {
        width: '100%',
    },
}));

export default function Reviews(props) {
    const classes = useStyles();
    const {
        reviews,
        loading,
        hasNextList,
        requestReviews,
        updateReviews,
    } = props;

    let lastAuthor = '';
    let lastPermlink = '';

    if (reviews.length > 0) {
        lastAuthor = reviews[reviews.length - 1].Author;
        lastPermlink = reviews[reviews.length - 1].Permlink;
    }

    const [values, setValues] = React.useState({
        movieType: 0,
        genreId: -1,
        languageCode: ' ',
        lastAuthor: '',
        lastPermlink: '',
        sortBy: 'created',
    });

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    function handleChange(event) {
        const newValues = {
            ...values,
            [event.target.name]: event.target.value,
        };

        setValues(newValues);
        updateReviews(newValues);
    }

    const handleSearch = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.root}>
                <form autoComplete="off">
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <InputLabel
                            ref={inputLabel}
                            htmlFor="outlined-movie-type"
                        >
                            Type
                        </InputLabel>
                        <Select
                            value={values.movieType}
                            onChange={handleChange}
                            input={
                                <OutlinedInput
                                    labelWidth={labelWidth}
                                    name="movieType"
                                    id="outlined-movie-type"
                                />
                            }
                        >
                            <MenuItem value={0}>
                                <em>Movie/TV</em>
                            </MenuItem>
                            <MenuItem value={1}>Movie</MenuItem>
                            <MenuItem value={2}>TV</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <InputLabel
                            ref={inputLabel}
                            htmlFor="outlined-language-code"
                        >
                            Language
                        </InputLabel>
                        <Select
                            value={values.languageCode}
                            onChange={handleChange}
                            input={
                                <OutlinedInput
                                    labelWidth={labelWidth}
                                    name="languageCode"
                                    id="outlined-language-code"
                                />
                            }
                        >
                            <MenuItem value={' '}>
                                <em>All Languages</em>
                            </MenuItem>
                            <MenuItem value={'en'}>English</MenuItem>
                            <MenuItem value={'ko'}>Korean</MenuItem>
                            <MenuItem value={'zh'}>Chinese</MenuItem>
                        </Select>
                    </FormControl>
                    {/* <FormControl
                        variant="outlined"
                        className={classes.formControl}
                    >
                        <InputLabel ref={inputLabel} htmlFor="outlined-sort-by">
                            Sort by
                        </InputLabel>
                        <Select
                            value={values.sortBy}
                            onChange={handleChange}
                            input={
                                <OutlinedInput
                                    labelWidth={labelWidth}
                                    name="sortBy"
                                    id="outlined-sort-by"
                                />
                            }
                        >
                            <MenuItem value={'created'}>
                                Review Created
                            </MenuItem>
                            <MenuItem value={'release_date'}>
                                Release Date
                            </MenuItem>
                        </Select>
                    </FormControl> */}
                    {/* <TextField
                        id="search-title"
                        name="title"
                        label="Search Title"
                        className={classes.formControl}
                        onChange={handleSearch('title')}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    /> */}
                </form>
                <main>
                    <Grid container spacing={4} className={classes.cardGrid}>
                        {reviews.map(post => (
                            <Grid
                                item
                                key={`${post.Author}/${post.Permlink}`}
                                xs={12}
                                md={6}
                            >
                                <CardActionArea
                                    component={Link}
                                    to={`/@${post.Author}/${post.Permlink}`}
                                >
                                    <Card className={classes.card}>
                                        <div className={classes.cardDetails}>
                                            <CardContent>
                                                <Typography
                                                    component="h2"
                                                    variant="h5"
                                                >
                                                    {post.Title}
                                                </Typography>
                                                <Typography
                                                    className={classes.cardDate}
                                                    variant="subtitle1"
                                                    color="textSecondary"
                                                >
                                                    <Grid
                                                        container
                                                        alignItems="center"
                                                    >
                                                        <TimeAgoWrapper
                                                            date={post.AddDate}
                                                        />
                                                        <Avatar
                                                            alt={post.Author}
                                                            src={`https://steemitimages.com/u/${
                                                                post.Author
                                                            }/avatar`}
                                                            className={
                                                                classes.avatar
                                                            }
                                                        />
                                                        @{post.Author}
                                                    </Grid>
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    paragraph
                                                >
                                                    {CustomUtil.getSummary(
                                                        post.Summary
                                                    )}
                                                </Typography>
                                                <Box
                                                    component="fieldset"
                                                    mb={3}
                                                    borderColor="transparent"
                                                    className={
                                                        classes.ratingBox
                                                    }
                                                >
                                                    <Rating
                                                        value={post.Rating}
                                                        max={3}
                                                        readOnly
                                                    />
                                                </Box>
                                            </CardContent>
                                        </div>
                                        {post.CoverImgUrl && (
                                            <Hidden xsDown>
                                                <CardMedia
                                                    className={
                                                        classes.cardMedia
                                                    }
                                                    image={post.CoverImgUrl}
                                                />
                                            </Hidden>
                                        )}
                                    </Card>
                                </CardActionArea>
                            </Grid>
                        ))}
                    </Grid>
                    {hasNextList ? (
                        loading ? (
                            <center>
                                <LoadingIndicator
                                    style={{ marginBottom: '2rem' }}
                                    type="circle"
                                />
                            </center>
                        ) : (
                            <Button
                                variant="outlined"
                                color="primary"
                                className={classes.button}
                                onClick={() => {
                                    requestReviews({
                                        movieType: values.movieType,
                                        genreId: values.genreId,
                                        languageCode: values.languageCode,
                                        lastAuthor,
                                        lastPermlink,
                                        sortBy: values.sortBy,
                                    });
                                }}
                            >
                                LOAD MORE REVIEWS
                            </Button>
                        )
                    ) : null}
                </main>
            </Container>
        </React.Fragment>
    );
}

module.exports = {
    path: '/review',
    component: connect(
        (state, ownProps) => {
            return {
                status: state.global.get('status'),
                loading: state.movie.get('loading'),
                accounts: state.global.get('accounts'),
                username:
                    state.user.getIn(['current', 'username']) ||
                    state.offchain.get('account'),
                blogmode: state.app.getIn(['user_preferences', 'blogmode']),
                categories: TAG_LIST,
                maybeLoggedIn: state.user.get('maybeLoggedIn'),
                isBrowser: process.env.BROWSER,
                gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
                reviews: state.movie.get('reviews').toJS(),
                hasNextList: state.movie.get('hasNextList'),
            };
        },
        dispatch => ({
            requestReviews: args => dispatch(movieActions.requestReviews(args)),
            updateReviews: args => dispatch(movieActions.updateReviews(args)),
        })
    )(Reviews),
};

Reviews.propTypes = {
    discussions: PropTypes.object,
    accounts: PropTypes.object,
    status: PropTypes.object,
    routeParams: PropTypes.object,
    requestReviews: PropTypes.func.isRequired,
    updateReviews: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    username: PropTypes.string,
    blogmode: PropTypes.bool,
    categories: PropTypes.object,
    reviews: PropTypes.array.isRequired,
    hasNextList: PropTypes.bool.isRequired,
};

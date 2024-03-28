import { useAdminContext } from "../../context/adminContext";
import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useTheme } from "../../context/theme";
import {
  AnalyticsRounded,
  ContentCopyRounded,
  ListAltRounded,
  Message,
  MonetizationOnRounded,
  PeopleAltRounded,
  ProductionQuantityLimitsRounded,
  Settings,
} from "@mui/icons-material";
import ArrowRight from "@mui/icons-material/ArrowRight";
import Home from "@mui/icons-material/Home";
import People from "@mui/icons-material/People";
import { Badge } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as React from "react";
import { FcAdvertising } from "react-icons/fc";
import { GrDeliver } from "react-icons/gr";
import { MdHome } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { styled as MUIStyled } from "@mui/material/styles";

const FireNav = styled(List)<{ component?: React.ElementType }>({
  "& .MuiListItemButton-root": {
    paddingLeft: 24,
    paddingRight: 24,
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: 16,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 24,
  },
});

interface TypeProps {
  activeTab: string;
  setActiveTab: (isActive: string) => void;
}

const Filter: React.FC<TypeProps> = () => {
  const [open, setOpen] = React.useState(true);
  const { theme } = useTheme();
  const { activeLanguage, isMobile } = useAppContext();

  const location = useLocation();
  const query = location.pathname;

  // current user
  const { currentUser } = useCurrentUserContext();

  // admin context
  const { unreadMessages, setOpenFilter } = useAdminContext();

  // custom badge
  const CustomBadge = MUIStyled(Badge)(({}) => ({
    // Add your custom styling here
    ".MuiBadge-dot": {
      backgroundColor: theme.primary, // Custom color for the badge dot
    },
    ".MuiBadge-badge": {
      color: theme.lightBackground, // Custom color for the badge text
      fontWeight: "600",
      backgroundColor: theme.primary, // Transparent background for the badge text
    },
  }));

  const data = [
    { icon: <ListAltRounded />, label: activeLanguage.orders, value: "Orders" },
    {
      icon: <ProductionQuantityLimitsRounded />,
      label: activeLanguage.products,
      value: "Products",
    },
    { icon: <People />, label: activeLanguage.users, value: "Users" },
    {
      icon: <AnalyticsRounded />,
      label: activeLanguage.analytics,
      value: "Analytics",
    },
    {
      icon: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CustomBadge
            badgeContent={<span>{unreadMessages}</span>}
            color="primary"
            invisible={unreadMessages === 0 ? true : false}
          >
            <Message style={{ color: theme.primaryText }} />
          </CustomBadge>
        </div>
      ),
      label: activeLanguage.messages,
      value: "Messages",
    },
    { icon: <PeopleAltRounded />, label: activeLanguage.team, value: "Team" },
    {
      icon: <GrDeliver size={20} style={{ margin: "0 2px" }} />,
      label: activeLanguage.shipping,
      value: "Shipping",
    },
    {
      icon: <MonetizationOnRounded />,
      label: activeLanguage.finances,
      value: "Finances",
    },
    {
      icon: (
        <RiCoupon2Line
          size={21}
          style={{ marginLeft: "1px", marginRight: "1px" }}
        />
      ),
      label: activeLanguage.coupons,
      value: "Coupons",
    },
    {
      icon: <ContentCopyRounded />,
      label: activeLanguage.content,
      value: "Content",
    },
    {
      icon: <FcAdvertising size={24} />,
      label: activeLanguage.advertisements,
      value: "Advertisements",
    },
    { icon: <Settings />, label: activeLanguage.settings, value: "Settings" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        width: isMobile ? "100%" : "300px",
        paddingLeft: isMobile ? "0px" : "24px",
      }}
    >
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
          palette: {
            mode: "dark",
            background: { paper: "transparent" },
          },
        })}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: isMobile ? "100%" : "300px",
            width: isMobile ? "100%" : "300px",
          }}
        >
          <FireNav component="nav" disablePadding>
            <ListItem
              component="div"
              disablePadding
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: theme.lightBackground,
              }}
            >
              <Link
                to="/"
                onClick={() => setOpenFilter(false)}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton sx={{ height: 56 }}>
                  <ListItemIcon>
                    <MdHome color={theme.primaryText} size={24} />
                  </ListItemIcon>
                  <h2
                    style={{
                      whiteSpace: "nowrap",
                      color: theme.primaryText,
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    {activeLanguage.projectOverview}
                  </h2>
                </ListItemButton>
              </Link>
              <Link
                to={
                  location.search.includes("overview")
                    ? `/admin/settings?overview=true`
                    : `/admin/settings`
                }
              >
                <Tooltip
                  title={activeLanguage.settings}
                  onClick={() => {
                    setOpenFilter(false);
                  }}
                >
                  <IconButton
                    size="large"
                    sx={{
                      "& svg": {
                        color: theme.primaryText,
                        transition: "0.2s",
                        transform: "translateX(0) rotate(0)",
                      },
                      "&:hover, &:focus": {
                        bgcolor: "unset",
                        "& svg:first-of-type": {
                          transform: "translateX(-4px) rotate(-20deg)",
                        },
                        "& svg:last-of-type": {
                          right: 0,
                          opacity: 1,
                        },
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        height: "80%",
                        display: "block",
                        left: 0,
                        width: "1px",
                        bgcolor: "divider",
                        color: theme.primaryText,
                      },
                    }}
                  >
                    <Settings />
                    <ArrowRight
                      sx={{ position: "absolute", right: 4, opacity: 0 }}
                    />
                  </IconButton>
                </Tooltip>
              </Link>
            </ListItem>

            <Box
              sx={{
                // bgcolor: open ? "rgba(71, 98, 130, 0.1)" : null,
                pb: open ? 2 : 0,
                marginTop: "24px",
              }}
            >
              {open &&
                data.map((item) => {
                  if (
                    currentUser?.admin?.access.some(
                      (i: any) =>
                        i.toLocaleString() === item.value?.toLocaleLowerCase()
                    ) ||
                    location.search.includes("overview")
                  ) {
                    return (
                      <Link
                        key={item.value}
                        to={
                          location.search.includes("overview")
                            ? `/admin/${item.value.toLocaleLowerCase()}?overview=true`
                            : `/admin/${item.value.toLocaleLowerCase()}`
                        }
                        onClick={() => setOpenFilter(false)}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <ListItemButton
                          sx={{
                            py: 0,
                            minHeight: 38,
                            color: "rgba(255,255,255,.8)",
                            background: query?.includes(
                              item.value.toLowerCase()
                            )
                              ? "rgba(255,255,255,0.05)"
                              : "transparent",
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: query?.includes(item.value.toLowerCase())
                                ? theme.primary
                                : theme.primaryText,
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <p
                            style={{
                              fontSize: 16,
                              // fontWeight: "medium",
                              letterSpacing: 0.5,
                              fontWeight: "600",
                              color: query?.includes(item.value.toLowerCase())
                                ? theme.primary
                                : theme.primaryText,
                            }}
                          >
                            {item.label}
                          </p>
                        </ListItemButton>
                      </Link>
                    );
                  }
                })}
            </Box>
          </FireNav>
        </Paper>
      </ThemeProvider>
    </Box>
  );
};

export default Filter;

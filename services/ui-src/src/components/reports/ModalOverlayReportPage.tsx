import { useContext, useState } from "react";
// components
import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import {
  AddEditEntityModal,
  DeleteEntityModal,
  EntityDetailsOverlay,
  EntityRow,
  MobileEntityRow,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import { EntityShape, EntityType, ModalOverlayReportPageShape } from "types";

// utils
import { useBreakpoint, useUser } from "utils";

// verbiage
import accordionVerbiage from "../../verbiage/pages/accordion";
import { EntityProvider } from "./EntityProvider";

export const ModalOverlayReportPage = ({ route, setSidebarHidden }: Props) => {
  const { isTablet, isMobile } = useBreakpoint();

  const { entityType, verbiage, modalForm, overlayForm } = route;
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const { report } = useContext(ReportContext);
  const reportType = report?.reportType;
  const reportFieldDataEntities = report?.fieldData[entityType] || [];
  const { userIsAdmin, userIsReadOnly } = useUser().user ?? {};
  const isAdminUserType = userIsAdmin || userIsReadOnly;
  const formIsDisabled = isAdminUserType && route.modalForm?.adminDisabled;
  // is MLR report in a LOCKED state
  const isLocked = report?.locked || formIsDisabled;

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle ? ` ${reportFieldDataEntities.length}` : ""
  }`;

  const tableHeaders = () => {
    if (isTablet || isMobile) return { headRow: ["", ""] };
    return { headRow: ["", verbiage.tableHeader, ""] };
  };

  // add/edit entity modal disclosure and methods
  const {
    isOpen: addEditEntityModalIsOpen,
    onOpen: addEditEntityModalOnOpenHandler,
    onClose: addEditEntityModalOnCloseHandler,
  } = useDisclosure();

  const openAddEditEntityModal = (entity?: EntityShape) => {
    if (entity) setSelectedEntity(entity);
    addEditEntityModalOnOpenHandler();
  };

  const closeAddEditEntityModal = () => {
    setSelectedEntity(undefined);
    addEditEntityModalOnCloseHandler();
  };

  // delete modal disclosure and methods
  const {
    isOpen: deleteEntityModalIsOpen,
    onOpen: deleteEntityModalOnOpenHandler,
    onClose: deleteEntityModalOnCloseHandler,
  } = useDisclosure();

  const openDeleteEntityModal = (entity: EntityShape) => {
    setSelectedEntity(entity);
    deleteEntityModalOnOpenHandler();
  };

  const closeDeleteEntityModal = () => {
    setSelectedEntity(undefined);
    deleteEntityModalOnCloseHandler();
  };

  // entity overlay disclosure and methods

  const openEntityDetailsOverlay = (entity: EntityShape) => {
    setSelectedEntity(entity);
    setIsEntityDetailsOpen(true);
    setSidebarHidden(true);
  };

  const closeEntityDetailsOverlay = () => {
    setSelectedEntity(undefined);
    setIsEntityDetailsOpen(false);
    setSidebarHidden(false);
  };

  return (
    <Box>
      {overlayForm && selectedEntity && isEntityDetailsOpen ? (
        <EntityProvider>
          <EntityDetailsOverlay
            entityType={entityType as EntityType}
            selectedEntity={selectedEntity}
            form={overlayForm}
            verbiage={verbiage}
            closeEntityDetailsOverlay={closeEntityDetailsOverlay}
            setSidebarHidden={setSidebarHidden}
          />
        </EntityProvider>
      ) : (
        <Box sx={sx.content}>
          {verbiage.intro && (
            <ReportPageIntro
              text={verbiage.intro}
              accordion={
                accordionVerbiage[reportType as keyof typeof accordionVerbiage]
                  ?.formIntro
              }
              reportType={reportType}
            />
          )}
          <Box sx={sx.dashboardBox}>
            <Heading as="h3" sx={sx.dashboardTitle}>
              {dashTitle}
            </Heading>
            {reportFieldDataEntities.length === 0 ? (
              <>
                <hr />
                <Box sx={sx.emptyDashboard}>{verbiage.emptyDashboardText}</Box>
              </>
            ) : (
              <Table sx={sx.header} content={tableHeaders()}>
                {reportFieldDataEntities.map(
                  (entity: EntityShape, entityIndex: number) =>
                    isMobile || isTablet ? (
                      <MobileEntityRow
                        key={entityIndex}
                        entity={entity}
                        verbiage={verbiage}
                        locked={isLocked}
                        openAddEditEntityModal={openAddEditEntityModal}
                        openDeleteEntityModal={openDeleteEntityModal}
                        openEntityDetailsOverlay={openEntityDetailsOverlay}
                      />
                    ) : (
                      <EntityRow
                        key={entity.id}
                        entity={entity}
                        verbiage={verbiage}
                        locked={isLocked}
                        openAddEditEntityModal={openAddEditEntityModal}
                        openDeleteEntityModal={openDeleteEntityModal}
                        openEntityDetailsOverlay={openEntityDetailsOverlay}
                      />
                    )
                )}
              </Table>
            )}
            <Button
              sx={sx.addEntityButton}
              disabled={isLocked}
              onClick={() => openAddEditEntityModal()}
            >
              {verbiage.addEntityButtonText}
            </Button>
            {report && (
              <>
                <AddEditEntityModal
                  entityType={entityType}
                  selectedEntity={selectedEntity}
                  verbiage={verbiage}
                  form={modalForm}
                  modalDisclosure={{
                    isOpen: addEditEntityModalIsOpen,
                    onClose: closeAddEditEntityModal,
                  }}
                />
                <DeleteEntityModal
                  entityType={entityType}
                  selectedEntity={selectedEntity}
                  verbiage={verbiage}
                  modalDisclosure={{
                    isOpen: deleteEntityModalIsOpen,
                    onClose: closeDeleteEntityModal,
                  }}
                />
              </>
            )}
          </Box>
          <ReportPageFooter hidePrevious={true} />
        </Box>
      )}
    </Box>
  );
};

interface Props {
  route: ModalOverlayReportPageShape;
  setSidebarHidden: Function;
}

const sx = {
  content: {
    ".tablet &, .mobile &": {
      width: "100%",
    },
  },
  dashboardBox: {
    textAlign: "center",
  },
  dashboardTitle: {
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
  },
  header: {
    tableLayout: "fixed",
    br: {
      marginBottom: "0.25rem",
    },
    th: {
      paddingLeft: "1rem",
      paddingRight: "0",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      ".tablet &, .mobile &": {
        border: "none",
      },
      "&:nth-child(1)": {
        width: "2.5rem",
      },
      "&:nth-child(3)": {
        width: "260px",
      },
    },
  },
  emptyDashboard: {
    paddingTop: "2rem",
  },
  addEntityButton: {
    marginTop: "1.5rem",
    marginBottom: "2rem",
    ".tablet &, .mobile &": {
      wordBreak: "break-word",
      whiteSpace: "break-spaces",
    },
  },
};

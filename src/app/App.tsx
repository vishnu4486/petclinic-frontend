// import { useEffect } from "react";

// import {
//   Alert,
//   Box,
//   CircularProgress,
//   Container,
//   Paper,
//   Stack,
//   Typography,
//   Button,
// } from "@mui/material";

// import PetsIcon from "@mui/icons-material/Pets";

// import { useApi } from "../hooks/useApi";
// import { ownersService } from "../features/owners/services/owners.service";
// import { ComponentShowcase } from "../components/common/ComponentShowcase";

// import type { OwnerPage } from "../types/owner.types";

// export default function App() {
//   const { data, loading, error, execute } = useApi<OwnerPage>();

//   useEffect(() => {
//     void execute(() =>
//       ownersService.getPage({
//         page: 0,
//         size: 10,
//       }),
//     );
//   }, [execute]);

//   const refresh = () => {
//     void execute(() =>
//       ownersService.getPage({
//         page: 0,
//         size: 10,
//       }),
//     );
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", py: 6 }}>
//       <Container maxWidth="lg">
//         <Paper sx={{ p: 4 }}>
//           <Stack spacing={3}>
//             <PetsIcon color="primary" sx={{ fontSize: 48 }} />

//             <Typography variant="h4" fontWeight={700}>
//               PetClinic Reception Desk
//             </Typography>

//             <Typography color="text.secondary">
//               Step 2 — Backend API Connection
//             </Typography>

//             <Button
//               variant="contained"
//               onClick={refresh}
//               disabled={loading}
//               sx={{ alignSelf: "flex-start" }}
//             >
//               Refresh Owners
//             </Button>

//             {loading && <CircularProgress size={30} />}

//             {error && <Alert severity="error">{error.message}</Alert>}

//             {data && (
//               <Alert severity="success">
//                 Backend connected successfully. Total owners:{" "}
//                 {data.totalElements}
//               </Alert>
//             )}

//             {data?.content.map((owner, index) => (
//               <Paper key={owner.id ?? index} variant="outlined" sx={{ p: 2 }}>
//                 <Typography fontWeight={600}>
//                   {owner.firstName} {owner.lastName}
//                 </Typography>

//                 <Typography color="text.secondary">
//                   {owner.city} — {owner.telephone}
//                 </Typography>
//               </Paper>
//             ))}
//           </Stack>
//         </Paper>
//         <ComponentShowcase />
//       </Container>
//     </Box>
//   );
// }

import { ReceptionDeskPage } from "../features/reception/pages/ReceptionDeskPage";

export default function App() {
  return <ReceptionDeskPage />;
}

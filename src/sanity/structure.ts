import type { StructureResolver } from "sanity/structure";
import { orderStatuses } from "./schemaTypes/order";
import { singletonTypes } from "./schemaTypes";

const storeTypes = new Set(["product", "order"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.listItem()
        .title("Store")
        .id("store")
        .child(
          S.list()
            .title("Store")
            .items([
              S.listItem()
                .title("Store settings")
                .id("storeSettings")
                .child(S.document().schemaType("storeSettings").documentId("storeSettings")),
              S.documentTypeListItem("product").title("Products"),
              S.listItem()
                .title("Orders")
                .id("orders")
                .child(
                  S.list()
                    .title("Orders")
                    .items([
                      S.listItem()
                        .title("All orders")
                        .id("orders-all")
                        .child(
                          S.documentList()
                            .title("All orders")
                            .schemaType("order")
                            .filter('_type == "order"')
                            .defaultOrdering([{ field: "placedAt", direction: "desc" }]),
                        ),
                      ...orderStatuses.map((status) =>
                        S.listItem()
                          .title(status.title)
                          .id(`orders-${status.value}`)
                          .child(
                            S.documentList()
                              .title(status.title)
                              .schemaType("order")
                              .filter('_type == "order" && status == $status')
                              .params({ status: status.value })
                              .defaultOrdering([{ field: "placedAt", direction: "desc" }]),
                          ),
                      ),
                    ]),
                ),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId() ?? "";
        return !singletonTypes.has(id) && !storeTypes.has(id);
      }),
    ]);
